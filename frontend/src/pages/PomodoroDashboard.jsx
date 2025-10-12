import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePomodoro } from '../hooks/usePomodoro';
import { useObjectDetection } from '../hooks/useObjectDetection';
import './PomodoroDashboard.css';

export default function PomodoroDashboard() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { user, logout } = useAuth();
    const [stream, setStream] = useState(null);

    const {
        formattedTime,
        isActive,
        sessionId,
        distractionCount,
        startSession,
        pauseSession,
        resumeSession,
        resetSession,
        endSession,
        reportDistraction
    } = usePomodoro();

    const {
        predictions,
        isDistracted,
        detectedObjects,
        modelLoaded
    } = useObjectDetection(videoRef, isActive);

    // Start webcam
    useEffect(() => {
        const startWebcam = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Failed to start webcam:', error);
            alert('Please allow webcam access to use Clearo');
        }
        };

        startWebcam();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Report distraction when detected
    useEffect(() => {
        if (isDistracted && isActive) {
            reportDistraction(detectedObjects);
        }
    }, [isDistracted, isActive]);

    // Draw bounding boxes
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current || predictions.length === 0) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            
            // Color based on object type
            const isPhone = prediction.class === 'cell phone';
            ctx.strokeStyle = isPhone ? '#ff4444' : '#4CAF50';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Label
            ctx.fillStyle = isPhone ? '#ff4444' : '#4CAF50';
            ctx.fillRect(x, y - 25, width, 25);
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText(
                `${prediction.class} ${Math.round(prediction.score * 100)}%`,
                x + 5,
                y - 7
            );
        });
    }, [predictions]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Clearo</h1>
                    <span className="user-info">Welcome, {user?.username}!</span>
                </div>
                <div className="header-right">
                    <div className="user-stats">
                        <div className="stat">
                            <span className="stat-label">Points</span>
                            <span className="stat-value">{user?.totalPoints || 0}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Streak</span>
                            <span className="stat-value">{user?.currentStreak || 0}🔥</span>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-logout">Logout</button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="video-section">
                    <div className="video-container">
                        <video ref={videoRef} autoPlay playsInline muted />
                        <canvas ref={canvasRef} className="detection-canvas" />
                        
                        <div className={`status-badge ${isDistracted ? 'distracted' : 'focused'}`}>
                            {isDistracted ? '⚠️ Distracted' : '✅ Focused'}
                        </div>

                        {!modelLoaded && (
                        <div className="loading-overlay">Loading AI model...</div>
                        )}
                    </div>

                    <div className="detected-objects">
                        <h3>Detected Objects:</h3>
                        <div className="object-tags">
                        {detectedObjects.length > 0 ? (
                            detectedObjects.map((obj, idx) => (
                            <span key={idx} className="object-tag">{obj}</span>
                            ))
                        ) : (
                            <span className="no-objects">No objects detected</span>
                        )}
                        </div>
                    </div>
                </div>

                <div className="timer-section">
                <div className="timer-display">
                    <h2>{formattedTime}</h2>
                </div>

                <div className="session-info">
                    {sessionId && (
                    <>
                        <p>Session Active</p>
                        <p className="distraction-count">
                        Distractions: {distractionCount}
                        </p>
                    </>
                    )}
                </div>

                <div className="timer-controls">
                    {!sessionId ? (
                    <button onClick={startSession} className="btn-start">
                        Start Pomodoro
                    </button>
                    ) : (
                    <>
                        {isActive ? (
                        <button onClick={pauseSession} className="btn-pause">
                            Pause
                        </button>
                        ) : (
                        <button onClick={resumeSession} className="btn-resume">
                            Resume
                        </button>
                        )}
                        <button onClick={endSession} className="btn-end">
                        End Session
                        </button>
                        <button onClick={resetSession} className="btn-reset">
                        Reset
                        </button>
                    </>
                    )}
                </div>

                <div className="progress-bar">
                    <div 
                    className="progress-fill" 
                    style={{ width: `${((25 * 60 - (parseInt(formattedTime.split(':')[0]) * 60 + parseInt(formattedTime.split(':')[1]))) / (25 * 60)) * 100}%` }}
                    />
                </div>
                </div>
            </main>
        </div>
    );
}