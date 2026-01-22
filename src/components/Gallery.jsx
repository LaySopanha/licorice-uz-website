import React, { useState } from 'react';
import './Gallery.css';
import PriceModal from './PriceModal';

// Product data with new images and specific descriptions
const galleryImages = [
    {
        id: 1,
        src: '/images-new/Бочонок A.jpg',
        title: 'БОЧОНОК A',
        description: 'Очищенный корень солодки высшего качества, отборная резка.'
    },
    {
        id: 2,
        src: '/images-new/Бочонок очищенный мих.jpg',
        title: 'Бочонок очищенный мих',
        description: 'Очищенный корень солодки, смешанная фракция.'
    },
    {
        id: 3,
        src: '/images-new/Гранулы.jpg',
        title: 'Гранулы',
        description: 'Корень солодки в гранулированной форме.'
    },
    {
        id: 4,
        src: '/images-new/Измельчённый.jpg',
        title: 'Измельчённый',
        description: 'Корень солодки дроблёный, смешанный помол.'
    },
    {
        id: 5,
        src: '/images-new/Палочки отборные стд.jpg',
        title: 'Палочки отборные стд',
        description: 'Корень солодки палочки стандартного калибра.'
    },
    {
        id: 6,
        src: '/images-new/Палочки отборные.jpg',
        title: 'Палочки отборные',
        description: 'Корень солодки палочки отборные по размеру.'
    },
    {
        id: 7,
        src: '/images-new/Палочки очищенные.jpg',
        title: 'Палочки очищенные',
        description: 'Очищенный корень солодки в палочках.'
    },
    {
        id: 8,
        src: '/images-new/Порошок.jpg',
        title: 'Порошок',
        description: 'Корень солодки мелкого помола, порошкообразный.'
    },
    {
        id: 9,
        src: '/images-new/Слайс A.jpg',
        title: 'Слайс A',
        description: 'Корень солодки резаный, отборные срезы высшего качества.'
    },
    {
        id: 10,
        src: '/images-new/Слайс мих.jpg',
        title: 'Слайс мих',
        description: 'Корень солодки резаный, смешанная фракция.'
    },
    {
        id: 11,
        src: '/images-new/Таблетка A.jpg',
        title: 'Таблетка A',
        description: 'Прессованный корень солодки, отборное сырьё.'
    },
    {
        id: 12,
        src: '/images-new/Таблетка мелкие A.jpg',
        title: 'Таблетка мелкие A',
        description: 'Таблетки малого размера, отборное сырьё.'
    },
    {
        id: 13,
        src: '/images-new/Таблетка мих.jpg',
        title: 'Таблетка мих',
        description: 'Корень солодки нарезаный вертикально, смешанные размеры.'
    },
    {
        id: 14,
        src: '/images-new/Щепки.jpg',
        title: 'Щепки',
        description: 'Корень солодки дроблёный в виде щепы.'
    },
    {
        id: 15,
        src: '/images-new/Индивидуальный заказ.png',
        title: 'Индивидуальный заказ',
        description: 'Производство и поставка корня солодки по индивидуальным требованиям.'
    }
];

const Gallery = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePriceClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
    };

    return (
        <section id="products" className="gallery-section">
            <div className="gallery-header">
                <h2>Наша Продукция</h2>
            </div>
            <div className="gallery-grid">
                {galleryImages.map((item) => (
                    <div key={item.id} className="gallery-card-item">
                        <div className="gallery-card-image">
                            <img src={item.src} alt={item.title} loading="lazy" />
                        </div>
                        <div className="gallery-card-content">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                            <button
                                className="btn-price"
                                onClick={() => handlePriceClick(item)}
                            >
                                Узнать цену
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <PriceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                productTitle={selectedProduct?.title || ''}
            />
        </section>
    );
};

export default Gallery;
