import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { language, switchLanguage, t } = useLanguage();

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    React.useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const toggleLanguage = () => {
        switchLanguage(language === 'ru' ? 'en' : 'ru');
    };

    const close = () => setIsOpen(false);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${isOpen ? 'menu-open' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/" onClick={close}>
                        <img src="/images/B5-logo.png" alt="Bogot Master Logo" />
                    </Link>
                </div>

                {/* Desktop nav links — inside nav, positioned in center grid column */}
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
