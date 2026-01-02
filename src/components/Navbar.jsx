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
                    <a href="#home">Главная</a>
                    <a href="#products">Каталог</a>
                    <a href="#about">О Компании</a>
                    <a href="#contact">Контакты</a>
                </div>
                <div className="navbar-cta-container">
                    <button className="btn-contact">Связаться</button>
                </div>
                <div className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
