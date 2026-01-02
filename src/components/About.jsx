import React from 'react';
import './About.css';

const About = () => {
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
                        <p className="about-description">
                            ООО «Глициризин Глабра» является частным предприятием. Работы по реализации корня солодки, и по выпуску густого экстракта солодкового корня были начаты в 1990 году. Солодковый корень и густой экстракт, выпускаемый нашим предприятием соответствует Государственному Стандарту (ГОСТ 22839-88 и ГОСТ 22840-77). В настоящее время действует производство по выпуску 200 тонн густого экстракта в год, влажностью 32-38% и содержанием глициризиновой кислоты не менее 14%. Также имеется в Республике Каракалпакстан производство по заготовке, добычи и выращивания корня, мощностью 3000 тонн корня в год. А также имеется производство по его нарезке в виде лепестков. Производительностью 100 тонн корня в месяц, на котором заняты 50 человек. Также имеется участок по прессованию и отгрузки заготовленного корня, производительностью 1000 тонн в год. Вес кипы — 100-150 кг. Размер 60х80х60, обвязанный проволокой или упаковочной лентой. Заготовка корня производиться на собственных плантациях.
                        </p>
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
                        <button className="btn-details">Подробнее</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
