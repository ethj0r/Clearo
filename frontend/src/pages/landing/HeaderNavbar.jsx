import "./HeaderNavbar.css";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function HeaderNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <nav className="top-strip" aria-label="Top strip">
                <p>
                    developed by <a className="highlight" href="https://ethjor.vercel.app" target="_blank" rel="noopener noreferrer">Jordhy Branenda</a>
                </p>
            </nav>
            <nav className="main-nav" aria-label="Main navigation">
                <div className="container">
                    <HashLink smooth to="/#" onClick={closeMenu}>
                        <h1 className="logo">Clearo</h1>
                    </HashLink>
                    
                    <button 
                        className="menu-toggle" 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                    
                    <ul className={menuOpen ? 'active' : ''}>
                        <li>
                            <HashLink smooth to="/#overview" onClick={closeMenu}>
                                Overview
                            </HashLink>
                        </li>
                        <li>
                            <HashLink smooth to="/#contact-us" onClick={closeMenu}>
                                Contact Us
                            </HashLink>
                        </li>
                        <li>
                            <Link to="/login" className="btn-primary" onClick={closeMenu}>
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}