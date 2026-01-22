import React from 'react';
import './Footer.css';
import { CONTACT_INFO, COMPANY_INFO } from '../config';

const Footer = () => {
    return (
        <footer className="footer" id="contact">
            <div className="footer-content">
                <div className="footer-logo">
                    <img src="/images/B5-logo.png" alt="Feruz" />
                    <p>Excellence in every detail.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>{CONTACT_INFO.address}</p>
                    <p>{CONTACT_INFO.email}</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
