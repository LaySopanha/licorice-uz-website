import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <img src="/images/B5-logo.png" alt="Feruz Logo" />
                </div>
                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <a href="#home" onClick={() => setIsOpen(false)}>Главная</a>
                    <a href="#products" onClick={() => setIsOpen(false)}>Каталог</a>
                    <a href="#about" onClick={() => setIsOpen(false)}>О Компании</a>
                    <a href="#contact" onClick={() => setIsOpen(false)}>Контакты</a>
                </div>
                <div className="navbar-cta-container">
                    <a href="#contact" className="btn-contact">Связаться</a>
                </div>
                <div className={`navbar-toggle ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
