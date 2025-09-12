import "./Dashboard.css"
import "../../styles/global.css";

export default function Dashboard() {
  return (
    <>

      {/* Timer section */}
      <section className="timer" id="timer">
        <div className="timer-container">

        </div>
      </section>

      {/* Webcam section */}
      <section className="cam" id="cam">
        <div className="cam-container">
        </div>
      </section>

      {/* Insights section */}
      <section className="insights" id="insights">
        <div className="insights-container">

        </div>
      </section>

    </>
  );
}
