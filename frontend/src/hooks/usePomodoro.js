import { useState, useEffect, useRef } from 'react';
import { sessionAPI } from '../services/api';

export const usePomodoro = (initialTime = 25 * 60) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [distractionCount, setDistractionCount] = useState(0);
    const intervalRef = useRef(null);
    const lastDistractionRef = useRef(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && sessionId) {
            handleEndSession();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    const startSession = async () => {
        try {
            const response = await sessionAPI.start(1);
            setSessionId(response.data.id);
            setIsActive(true);
            setTimeLeft(initialTime);
            setDistractionCount(0);
            console.log('Session started:', response.data.id);
        } catch (error) {
            console.error('Failed to start session:', error);
            alert('Failed to start session. Please try again.');
        }
    };

    const pauseSession = () => {
        setIsActive(false);
    };

    const resumeSession = () => {
        setIsActive(true);
    };

    const resetSession = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
        setSessionId(null);
        setDistractionCount(0);
    };

    const handleEndSession = async () => {
        if (!sessionId) return;

        try {
        const response = await sessionAPI.end(sessionId);
        console.log('Session ended:', response.data);
        

        alert(`
            Session Complete!
            Points Earned: ${response.data.pointsEarned}
            Total Points: ${response.data.totalPoints}
            Current Streak: ${response.data.currentStreak}
        `);

        resetSession();
        return response.data;
        } catch (error) {
            console.error('Failed to end session:', error);
            alert('Failed to end session. Please try again.');
        }
    };

    const reportDistraction = async (detectedObjects = []) => {
        if (!sessionId) return;

        // Prevent duplicate reports within 5 seconds
        const now = Date.now();
            if (lastDistractionRef.current && now - lastDistractionRef.current < 5000) {
            return;
        }

        try {
            await sessionAPI.update(sessionId, true, detectedObjects);
            setDistractionCount(prev => prev + 1);
            lastDistractionRef.current = now;
            console.log('Distraction reported');
        } catch (error) {
            console.error('Failed to report distraction:', error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        timeLeft,
        formattedTime: formatTime(timeLeft),
        isActive,
        sessionId,
        distractionCount,
        startSession,
        pauseSession,
        resumeSession,
        resetSession,
        endSession: handleEndSession,
        reportDistraction
    };
};