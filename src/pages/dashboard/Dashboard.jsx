import { useState, useEffect, useRef } from "react";
import "./Dashboard.css";

export default function Dashboard() {
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(3600); // 60 minutes in seconds
    const [cycleCount, setCycleCount] = useState(9);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Timer logic
    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    // Camera initialization
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}.${secs.toString().padStart(2, "0")}`;
    };

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(3600);
    };

    const skipTimer = () => {
        setIsRunning(false);
        setTime(3600);
        if (cycleCount > 0) {
            setCycleCount(cycleCount - 1);
        }
    };

    const handleUserInput = () => {
        if (isCameraActive) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    return (
        <div className="dashboard">
            {/* Timer Section */}
            <section className="timer-section">
                <div className="timer-container">
                    <div className="timer-controls">
                        <button
                            className="control-btn play-btn"
                            onClick={toggleTimer}
                            aria-label={isRunning ? "Pause" : "Play"}
                        >
                            {isRunning ? "⏸" : "▶"}
                        </button>
                        <button
                            className="control-btn stop-btn"
                            onClick={resetTimer}
                            aria-label="Stop"
                        >
                            ✕
                        </button>
                        <button
                            className="control-btn skip-btn"
                            onClick={skipTimer}
                            aria-label="Skip"
                        >
                            ⏭
                        </button>
                    </div>
                    <div className="timer-display">{formatTime(time)}</div>
                </div>

                <div className="focus-card">
                    <div className="focus-header">
                        <h2 className="focus-title">Focus</h2>
                        <div className="cycle-badge">{cycleCount}</div>
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
                            {!isCameraActive && (
                                <div className="webcam-placeholder">
                                    <span className="camera-icon">📷</span>
                                    <p>Camera not active</p>
                                </div>
                            )}
                            {/* Canvas for future ML model overlay */}
                            <canvas 
                                className="detection-canvas"
                                style={{ display: 'none' }}
                            />
                        </div>

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
                                style={{ width: `${((3600 - time) / 3600) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights Section */}
            <section className="insights-section">
                <h2 className="insights-title">Insights</h2>
                <div className="insights-grid">
                    <div className="insight-card large-card"></div>
                    <div className="insight-card-row">
                        <div className="insight-card small-card"></div>
                        <div className="insight-card small-card"></div>
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