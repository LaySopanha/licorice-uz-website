import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <h1>Экспортёр солодки<br />для B2B-клиентов</h1>
                <p>Объёмы поставок, рынки, ключевые преимущества</p>
                <button className="btn-primary">Запросить коммерческое предложение</button>
            </div>
            <div className="hero-image">
                <img src="/images/main-hero-image-display.png" alt="Licorice Roots" />
            </div>
        </section>
    );
};

export default Hero;
