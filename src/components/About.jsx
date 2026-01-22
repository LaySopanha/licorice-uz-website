import React, { useState } from 'react';
import './About.css';
import PriceModal from './PriceModal';

const About = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <section className="about-section" id="about">
            <div className="about-container">
                <div className="about-header">
                    <h2>О компании</h2>
                </div>
                <div className="about-content">
                    <div className="about-images">
                        {/* Implied collage structure */}
                        <div className="image-main">
                            <img src="/images/image16.png" alt="Warehouse storage" loading="lazy" />
                        </div>
                        <div className="image-secondary">
                            <img src="/images/image17.png" alt="Worker with product" loading="lazy" />
                        </div>
                        <div className="image-tertiary">
                            <img src="/images/image18.png" alt="Truck loading" loading="lazy" />
                        </div>
                    </div>
                    <div className="about-text">
                        <div className="about-description">
                            <p>
                                Bogot Master — семейная компания, основанная в 2014 году, специализирующаяся на заготовке, переработке и экспорте корня солодки.
                            </p>
                            <p>
                                Компания осуществляет экспорт корня солодки в различных формах поставки и работает со всеми необходимыми разрешительными документами и сертификатами, в соответствии с требованиями стран-импортёров.
                            </p>
                            <p>
                                Производственные и заготовительные мощности Bogot Master позволяют осуществлять экспорт до 1 500 тонн корня солодки в год. В деятельности компании задействовано более 20 сотрудников, обеспечивающих контроль качества, переработку, упаковку и логистику продукции.
                            </p>
                            <p>
                                Заготовка корня солодки осуществляется с соблюдением установленных технологических и экологических требований. Компания ориентирована на стабильные долгосрочные поставки и индивидуальный подход к требованиям заказчиков по форме, фракции и упаковке продукции.
                            </p>
                        </div>
                        <ul className="about-benefits">
                            <li>
                                <span className="check-icon">✓</span>
                                Поставка по всему Узбекистану
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Сотрудничество на оптом
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Качество и сертификация
                            </li>
                            <li>
                                <span className="check-icon">✓</span>
                                Все виды в наличии круглый год
                            </li>
                        </ul>
                        <button className="btn-details" onClick={openModal}>Подробнее</button>
                    </div>
                </div>
            </div>

            <PriceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                productTitle="Консультация о компании"
            />
        </section>
    );
};

export default About;
