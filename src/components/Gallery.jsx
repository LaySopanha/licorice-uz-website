import React, { useState } from 'react';
import './Gallery.css';
import PriceModal from './PriceModal';

// Product data with new images and specific descriptions
const galleryImages = [
    {
        id: 1,
        src: '/images-new/product-1.jpg',
        title: 'БОЧОНОК A',
        description: 'Очищенный корень солодки высшего качества, отборная резка.'
    },
    {
        id: 2,
        src: '/images-new/product-2.jpg',
        title: 'Бочонок очищенный мих',
        description: 'Очищенный корень солодки, смешанная фракция.'
    },
    {
        id: 3,
        src: '/images-new/product-3.jpg',
        title: 'Гранулы',
        description: 'Корень солодки в гранулированной форме.'
    },
    {
        id: 4,
        src: '/images-new/product-4.jpg',
        title: 'Измельчённый',
        description: 'Корень солодки дроблёный, смешанный помол.'
    },
    {
        id: 5,
        src: '/images-new/product-5.jpg',
        title: 'Палочки отборные стд',
        description: 'Корень солодки палочки стандартного калибра.'
    },
    {
        id: 6,
        src: '/images-new/product-6.jpg',
        title: 'Палочки отборные',
        description: 'Корень солодки палочки отборные по размеру.'
    },
    {
        id: 7,
        src: '/images-new/product-7.jpg',
        title: 'Палочки очищенные',
        description: 'Очищенный корень солодки в палочках.'
    },
    {
        id: 8,
        src: '/images-new/product-8.jpg',
        title: 'Порошок',
        description: 'Корень солодки мелкого помола, порошкообразный.'
    },
    {
        id: 9,
        src: '/images-new/product-9.jpg',
        title: 'Слайс A',
        description: 'Корень солодки резаный, отборные срезы высшего качества.'
    },
    {
        id: 10,
        src: '/images-new/product-10.jpg',
        title: 'Слайс мих',
        description: 'Корень солодки резаный, смешанная фракция.'
    },
    {
        id: 11,
        src: '/images-new/product-11.jpg',
        title: 'Таблетка A',
        description: 'Прессованный корень солодки, отборное сырьё.'
    },
    // {
    //     id: 12,
    //     src: '/images-new/product-12.jpg',
    //     title: 'Таблетка мелкие A',
    //     description: 'Таблетки малого размера, отборное сырьё.'
    // },
    {
        id: 13,
        src: '/images-new/product-13.jpg',
        title: 'Таблетка мих',
        description: 'Корень солодки нарезаный вертикально, смешанные размеры.'
    },
    {
        id: 14,
        src: '/images-new/product-14.jpg',
        title: 'Щепки',
        description: 'Корень солодки дроблёный в виде щепы.'
    },
    {
        id: 15,
        src: '/images-new/product-15.jpg',
        title: 'Индивидуальный заказ',
        description: 'Производство и поставка корня солодки по индивидуальным требованиям.'
    },
    {
        id: 16,
        src: '/images-new/product-16.png',
        title: 'Экстракт корня солодки',
        description: 'Экстракт корня солодки в порошкообразной и жидкой форме'
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
