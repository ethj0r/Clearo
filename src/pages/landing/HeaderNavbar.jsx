// import { Link } from "react-router-dom";
import "./HeaderNavbar.css";
import { HashLink } from "react-router-hash-link";

export default function HeaderNavbar() {
  return (
    <>
      <nav className="top-strip" aria-label="Top strip">
        <p>
          developed by <a className="highlight" href="ethjor.vercel.app">Jordhy Branenda</a>
        </p>
      </nav>

      <nav className="main-nav" aria-label="Main navigation">
        <div className="container">
        <HashLink smooth to="/#"> <h1 className="logo">Clearo</h1></HashLink>
          <ul>
            <li><HashLink smooth to="/#overview">Overview</HashLink></li>
            <li><HashLink smooth to="/#contact-us" className="btn-primary">Contact us</HashLink></li>
          </ul>
        </div>
      </nav>
    </>

  );
}
