import React from 'react';
import './Partners.css';

const Partners = () => {
    // Repeated logos for demonstration as per screenshot
    const partners = [1, 2, 3, 4];

    return (
        <section className="partners-section">
            <h2 className="partners-title">Наши Партнеры</h2>
            <div className="partners-grid">
                {partners.map((id) => (
                    <div key={id} className="partner-logo">
                        <img src="/images/logoipisum.png" alt="Partner Logo" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Partners;
