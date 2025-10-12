import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useObjectDetection } from '../../hooks/useObjectDetection';
import './Dashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const { user, logout } = useAuth();
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    const {
        formattedTime,
        isActive: isRunning,
        sessionId,
        distractionCount,
        startSession,
        pauseSession,
        resumeSession,
        resetSession,
        endSession,
        reportDistraction
    } = usePomodoro(3600);

    const {
        predictions,
        isDistracted,
        detectedObjects,
        modelLoaded
    } = useObjectDetection(videoRef, isRunning && isCameraActive);

    const startCamera = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            }
        });
        
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setIsCameraActive(true);
            setCameraError(null);
        }
        } catch (error) {
            console.error("Error accessing camera:", error);
            setCameraError("Failed to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
            if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const handleUserInput = () => {
        if (isCameraActive) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    useEffect(() => {
        if (isDistracted && isRunning && sessionId) {
            reportDistraction(detectedObjects);
        }
    }, [isDistracted, isRunning, sessionId]);

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
            
            const isPhone = prediction.class === 'cell phone';
            ctx.strokeStyle = isPhone ? '#ff3b30' : '#0088ff';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = isPhone ? '#ff3b30' : '#0088ff';
            ctx.fillRect(x, y - 25, width, 25);
            ctx.fillStyle = 'white';
            ctx.font = '14px system-ui';
            ctx.fillText(
                `${prediction.class} ${Math.round(prediction.score * 100)}%`,
                x + 5,
                y - 7
            );
        });
    }, [predictions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const handleStartSession = async () => {
        if (!isCameraActive) {
            alert('Please start camera first to begin session');
            return;
        }
        await startSession();
    };

    const handleEndSession = async () => {
        const result = await endSession();
        if (result) {
            console.log('Session completed:', result);
        }
    };

    const handleLogout = () => {
        if (sessionId) {
            if (window.confirm('You have an active session. End it before logging out?')) {
                handleEndSession();
            }
        }
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard">
            {/* Header with user info */}
            <div className="dashboard-header">
                <div className="user-stats-header">
                    <span className="username-display">Hey, {user?.username}!</span>
                    <div className="stats-inline">
                        <span className="stat-item">⭐ {user?.totalPoints || 0} pts</span>
                        <span className="stat-item">🔥 {user?.currentStreak || 0} streak</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                Logout
                </button>
            </div>

            {/* Timer Section */}
            <section className="timer-section">
                <div className="timer-container">
                    <div className="timer-controls">
                        <button
                            className="control-btn play-btn"
                            onClick={isRunning ? pauseSession : (sessionId ? resumeSession : handleStartSession)}
                            aria-label={isRunning ? "Pause" : "Play"}
                            disabled={!modelLoaded && isCameraActive}
                            >
                            {isRunning ? "⏸" : "▶"}
                        </button>
                        <button
                            className="control-btn stop-btn"
                            onClick={resetSession}
                            aria-label="Stop"
                            disabled={!sessionId}
                            >
                            ✕
                        </button>
                        <button
                            className="control-btn skip-btn"
                            onClick={handleEndSession}
                            aria-label="End Session"
                            disabled={!sessionId}
                            >
                            ⏭
                        </button>
                    </div>
                <div className="timer-display">{formattedTime}</div>
                </div>

                <div className="focus-card">
                    <div className="focus-header">
                        <h2 className="focus-title">
                            {sessionId ? (isRunning ? 'Focus Mode Active' : 'Paused') : 'Ready to Focus'}
                        </h2>
                        <div className="cycle-badge" title="Distractions">
                            {distractionCount}
                        </div>
                    </div>

                    <div className="focus-content">
                        {/* Webcam Video */}
                        <div className="webcam-container">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`webcam-video ${isCameraActive ? 'active' : ''}`}
                                style={{
                                transform: 'scaleX(-1)',
                                WebkitTransform: 'scaleX(-1)'
                                }}
                            />
                            
                            {isCameraActive && (
                                <canvas 
                                ref={canvasRef}
                                className="detection-canvas"
                                style={{ 
                                    display: predictions.length > 0 ? 'block' : 'none',
                                    transform: 'scaleX(-1)',
                                    WebkitTransform: 'scaleX(-1)'
                                }}
                                />
                            )}

                            {!isCameraActive && (
                                <div className="webcam-placeholder">
                                    <span className="camera-icon">📷</span>
                                    <p>Camera not active</p>
                                </div>
                            )}

                            {isCameraActive && !modelLoaded && (
                                <div className="model-loading">
                                    <p>Loading AI model...</p>
                                </div>
                            )}

                            {isCameraActive && sessionId && (
                                <div className={`status-badge ${isDistracted ? 'distracted' : 'focused'}`}>
                                    {isDistracted ? 'Distracted' : 'Focused'}
                                </div>
                            )}
                        </div>

                        {isCameraActive && detectedObjects.length > 0 && (
                        <div className="detected-objects-list">
                            <p className="detected-label">Detected:</p>
                            <div className="object-tags">
                                {detectedObjects.map((obj, idx) => (
                                    <span key={idx} className="object-tag">{obj}</span>
                                ))}
                            </div>
                        </div>
                        )}

                        {cameraError && (
                            <div className="camera-error">{cameraError}</div>
                        )}

                        <button 
                            className={`user-input-btn ${isCameraActive ? 'active' : ''}`}
                            onClick={handleUserInput}
                            >
                            {isCameraActive ? "Stop Camera" : "Start Camera"}
                        </button>
                        
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((3600 - (parseInt(formattedTime.split('.')[0]) * 60 + parseInt(formattedTime.split('.')[1]))) / 3600) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights Section */}
            <section className="insights-section">
                <h2 className="insights-title">Session Stats</h2>
                <div className="insights-grid">
                    <div className="insight-card large-card">
                        <div className="insight-content">
                            <h3>Current Session</h3>
                            {sessionId ? (
                                <>
                                <p className="insight-value">{formattedTime}</p>
                                <p className="insight-label">Time Remaining</p>
                                <p className="insight-secondary">
                                    Distractions: {distractionCount}
                                </p>
                                </>
                            ) : (
                                <p className="insight-empty">No active session</p>
                            )}
                        </div>
                    </div>
                    <div className="insight-card-row">
                        <div className="insight-card small-card">
                            <div className="insight-content">
                                <h3>Total Points</h3>
                                <p className="insight-value">{user?.totalPoints || 0}</p>
                            </div>
                        </div>
                        <div className="insight-card small-card">
                            <div className="insight-content">
                                <h3>Best Streak</h3>
                                <p className="insight-value">{user?.longestStreak || 0} 🔥</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tagline Section */}
            <section className="tagline-section">
                <blockquote className="tagline">
                    Clear Your Desk, Clear Your Mind.
                    <br />
                    Focus Made Visible.
                </blockquote>
            </section>
        </div>
    );
}