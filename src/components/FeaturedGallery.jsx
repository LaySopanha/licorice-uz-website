import React from 'react';
import './FeaturedGallery.css';

const products = [
    {
        id: 1,
        src: '/images/image3.png', // Slices/Chunks
        title: 'Корень нарезанный в форме лепестков',
        description: 'Также мы производим нарезку солодкового корня по форме лепестков (слайсы).',
    },
    {
        id: 2,
        src: '/images/image4.png', // Bundled sticks
        title: 'Корень лакрицы',
        description: 'Мы можем предложить Вам разные виды корня солодки — прессованный или в форме палочек.',
    },
    {
        id: 3,
        src: '/images/image5.png', // Guessing Powder
        title: 'Порошок из экстракта солодки',
        description: 'Из производимого нами экстракта мы также производим порошок.',
    },
];

const FeaturedGallery = () => {
    return (
        <section id="gallery" className="featured-gallery-section">
            <div className="gallery-header">
                <h2>Галерея</h2>
            </div>
            <div className="featured-gallery-grid">
                {products.map((item) => (
                    <div key={item.id} className="featured-gallery-card">
                        <div className="card-image">
                            <img src={item.src} alt={item.title} loading="lazy" />
                        </div>
                        <div className="card-content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="featured-gallery-footer">
                <button className="btn-learn-more">Узнать больше</button>
            </div>
        </section>
    );
};

export default FeaturedGallery;
