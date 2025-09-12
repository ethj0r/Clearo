import "../../styles/global.css";
import "./Landing.css";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-container">
          <h1 className="hero-title">
            Clear Your Desk, Clear Your Mind.
            <br />
            Focus Made Visible.
          </h1>
          <Link to="/dashboard">
            <button link="../dashboard/Dashboard.jsx"className="hero-btn">Get Started</button>
          </Link>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview" id="overview">
        <div className="overview-container">
          <h2 className="overview-title">Overview</h2>
          <p className="overview-text">
            <span className="quote">’</span>
            <span className="brand">Clearo</span> helps you stay focused by detecting distractions on your desk in real time. 
            Using your <span className="highlight">webcam</span>, <span className="brand">Clearo</span> identifies items like smartphones, 
            books, and laptops, giving you a productivity score and actionable insights during your 
            <span className="muted"> Pomodoro sessions.</span>
          </p>

          <div className="key-features">
            <div className="key-features-container">
              <p className="key-features-title">Key features</p>
              
              <div className="feature-item">
                <p className="feature-title">Real-Time Object Detection</p>
                <p className="feature-desc">Know what's on your desk instantly and spot potential distractions.</p>
              </div>

              <div className="feature-item">
                <p className="feature-title">Pomodoro Integration</p>
                <p className="feature-desc">Stay on track with customizable focus and break timers.</p>
              </div>

              <div className="feature-item">
                <p className="feature-title">Productiviy Scoring & Insights</p>
                <p className="feature-desc">Track your focus and get feedback to improve every sessions.</p>
              </div>

              <div className="feature-item">
                <p className="feature-title">Visual & Interactive Dashboard</p>
                <p className="feature-desc">See your desk, your score, and your streaks all in one place.</p>
              </div>
            </div>

          <p className="overview-text overview-quotes">
              <span className="quote-last">'</span>
              See your focus. Boost your productivity.<br/>
              Start your first session now!
          </p>

          </div>
          
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-us" id="contact-us">
        <div className="contact-us-container">
          <h2 className="contact-us-title overview-title">Contact Us</h2>

          <div className="contact-card">
            <div className="contact-info">
              <div className="row">
                <span className="label">E-mail</span>
                <span className="value">
                  13524026@mahasiswa.itb.ac.id<br />
                  ethgalleryin@gmail.com
                </span>
              </div>

              <div className="row">
                <span className="label">GitHub</span>
                <span className="value">ethj0r</span>
              </div>

              <div className="row">
                <span className="label">LinkedIn</span>
                <span className="value">Made Branenda Jordhy</span>
              </div>

              <div className="row">
                <span className="label">Personal Site</span>
                <span className="value">ethjor.vercel.app</span>
              </div>

              <div className="row">
                <span className="label">Instagram</span>
                <span className="value">@jordhhhy</span>
              </div>
            </div>

            <div className="contact-avatar">
              <img src="memoji.webp" alt="Memoji" />
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
