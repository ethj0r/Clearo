import "../../styles/global.css";
import "./Landing.css";
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
          <button className="hero-btn">Get Started</button>
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
          <h2>Contact Us</h2>
          <p>Lorem ipsum</p>
        </div>
      </section>

    </>
  );
}
