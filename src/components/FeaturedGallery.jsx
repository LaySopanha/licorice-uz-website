import { useMemo } from 'react';
import './FeaturedGallery.css';
import Skeleton from './Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const FeaturedGallery = () => {
    const { t } = useLanguage();
    const { gallery, loading } = useContent();

    const shuffled = useMemo(() => {
        if (!gallery) return [];
        const arr = [...gallery];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [gallery]);

    if (loading) {
        return (
            <section id="gallery" className="featured-gallery-section">
                <div className="gallery-header">
                    <h2>{t('gallery_title')}</h2>
                </div>
                <div className="featured-gallery-grid">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="featured-gallery-card">
                            <Skeleton type="rect" style={{ height: '100%', aspectRatio: '1', borderRadius: '12px' }} />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (!shuffled.length) return null;

    return (
        <section id="gallery" className="featured-gallery-section">
            <div className="gallery-header">
                <h2>{t('gallery_title')}</h2>
            </div>
            <div className="featured-gallery-grid">
                {shuffled.map((src, index) => (
                    <div key={index} className="featured-gallery-card">
                        <div className="card-image">
                            <img src={src} alt={`Gallery item ${index + 1}`} loading="lazy" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedGallery;
