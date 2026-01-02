import React, { useState } from 'react';
import './Gallery.css';
import PriceModal from './PriceModal';

// Generate 15 items for the grid (images 1-15)
const galleryImages = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    src: `/images/image${i + 1}.png`,
    title: 'Большие корни Солодки',
    description: 'Lorem ipsum dolar sit amet consectetur.',
}));

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
