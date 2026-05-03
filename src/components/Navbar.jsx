import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, switchLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        switchLanguage(language === 'ru' ? 'en' : 'ru');
    };

    const close = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" onClick={close}>
                        <img src="/images/B5-logo.png" alt="Bogot Master Logo" />
                    </Link>
                </div>
                <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
                    <NavLink to="/" end onClick={close}>{t('home')}</NavLink>
                    <NavLink to="/products" onClick={close}>{t('products')}</NavLink>
                    <NavLink to="/about" onClick={close}>{t('about')}</NavLink>
                    <NavLink to="/contact" onClick={close}>{t('contact')}</NavLink>
                    <button className="lang-btn-mobile" onClick={toggleLanguage}>
                        {t('langBtn')}
                    </button>
                </div>
                <div className="navbar-cta-container">
                    <button className="lang-btn" onClick={toggleLanguage}>
                        {t('langBtn')}
                    </button>
                    <Link to="/contact" className="btn-contact" onClick={close}>
                        {t('contactBtn')}
                    </Link>
                </div>
                <div
                    className={`navbar-toggle ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
