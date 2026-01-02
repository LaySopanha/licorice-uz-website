import React from 'react';
import './Certificates.css';

const Certificates = () => {
    // Placeholder data
    const certificates = [
        { id: 1, title: 'Сертификат на густой экстракт' },
        { id: 2, title: 'Сертификат на корень в форме лепестков' },
        { id: 3, title: 'Сертификат на палочки солодкового корня' },
        { id: 4, title: 'ГОСТы' },
    ];

    return (
        <section className="certificates-section">
            <div className="certificates-header">
                <h2>Наши Сертификаты</h2>
            </div>

            <div className="certificates-wrapper">
                {/* Navigation Arrow Left - Placeholder */}
                <button className="nav-arrow left" aria-label="Previous">
                    ←
                </button>

                <div className="certificates-container">
                    <div className="certificates-grid">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="certificate-item">
                                <div className="cert-icon-box">
                                    {/* Download Icon SVG */}
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </div>
                                <p className="cert-title">{cert.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrow Right - Placeholder */}
                <button className="nav-arrow right" aria-label="Next">
                    →
                </button>
            </div>
        </section>
    );
};

export default Certificates;
