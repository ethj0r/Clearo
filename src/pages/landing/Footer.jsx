// import { Link } from "react-router-dom";
import "./Footer.css";
import { HashLink } from "react-router-hash-link";

export default function Footer() {
  return (
    <>
      <nav className="bottom-strip" aria-label="Bottom strip">
        <p>
          © 2025 <a className="highlight" href="https://ethjor.vercel.app" target="_blank" rel="noopener noreferrer">Jordhy Branenda</a>
        </p>
      </nav>
    </>

  );
}