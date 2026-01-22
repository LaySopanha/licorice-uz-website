import React, { useState } from 'react';
import './Hero.css';
import PriceModal from './PriceModal';

const Hero = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <h1>Экспортёр солодки<br />для B2B-клиентов</h1>
                <p>Объёмы поставок, рынки, ключевые преимущества</p>
                <button className="btn-primary" onClick={openModal}>Запросить коммерческое предложение</button>
            </div>
            <div className="hero-image">
                <img src="/images/hero-bg-new.png" alt="Licorice Roots" />
            </div>

            <PriceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                productTitle="Коммерческое предложение"
            />
        </section>
    );
};

export default Hero;
