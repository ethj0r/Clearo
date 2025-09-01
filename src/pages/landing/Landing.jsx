import "../../styles/global.css";
import "./Landing.css";

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1 className="hero-title">
            Clear Your Desk, Clear Your Mind.
            <br />
            Focus Made Visible.
          </h1>
          <button className="hero-btn">Get Started</button>
        </div>
      </section>

      <div className="layout">

        {/* Overview Section */}
        <section className="overview">
          <div className="overview-container">
            <h2>Overview</h2>
            <p>Lorem ipsum</p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-us">
          <div className="contact-us-container">
            <h2>Contact Us</h2>
            <p>Lorem ipsum</p>
          </div>
        </section>

      </div>

    </>
  );
}
