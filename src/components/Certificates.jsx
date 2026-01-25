import React from 'react';
import './Certificates.css';

const Certificates = () => {
    // Placeholder data
    const certificates = [
        { id: 1, title: 'Выписка из реестра', file: '/Certificate/Выписка%20из%20реестра.pdf' },
        { id: 2, title: 'Свидетельство НДС', file: '/Certificate/Свидетельство%20НДС.pdf' },
        { id: 3, title: 'Свидетельство о регистрации', file: '/Certificate/Свидетельство%20о%20регистрации.pdf' },
        { id: 4, title: 'Удостоверение о регистрации', file: '/Certificate/Удостоверение%20о%20регистрации.pdf' },
    ];

    return (
        <section className="certificates-section">
            <div className="certificates-header">
                <h2>Наши документы</h2>
            </div>

            <div className="certificates-wrapper">
                <div className="certificates-container">
                    <div className="certificates-grid">
                        {certificates.map((cert) => (
                            <a
                                key={cert.id}
                                href={cert.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="certificate-item"
                            >
                                <div className="cert-icon-box">
                                    {/* Download Icon SVG */}
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                </div>
                                <p className="cert-title">{cert.title}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Certificates;
