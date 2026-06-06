import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PriceModal from '../components/PriceModal';
import QuoteButton from '../components/QuoteButton';
import { ProductDetailSkeleton } from '../components/Skeleton';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import './ProductDetail.css';

const ProductDetail = ({ addToast }) => {
    useReveal();
    const { slug } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { products, loading } = useContent();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [relatedProgress, setRelatedProgress] = useState(10);
    const relatedRef = useRef(null);

    const handleRelatedScroll = () => {
        const el = relatedRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return;
        setRelatedProgress(10 + (el.scrollLeft / max) * 90);
    };

    const product = products.find(p => p.slug === slug);
    const related = products.filter(p => p.slug !== slug).slice(0, 3);

    useEffect(() => {
        if (!loading && !product) {
            navigate('/products', { replace: true });
        }
    }, [loading, product, navigate]);

    if (loading || !product) {
        return (
            <Layout>
                <div className="pd-section">
                    <ProductDetailSkeleton />
                </div>
            </Layout>
        );
    }

    const siteUrl = 'https://bogotmaster.org';
    const productImage = product.image?.startsWith('http')
        ? product.image
        : `${siteUrl}${product.image}`;
    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.title,
        'description': product.description,
        'image': productImage,
        'category': 'Licorice Root',
        'brand': { '@type': 'Brand', 'name': 'Bogot Master' },
        'manufacturer': { '@type': 'Organization', 'name': 'Bogot Master' },
    };

    return (
        <Layout>
            <SEO
                title={`${product.title} — Bogot Master`}
                description={product.description}
                image={productImage}
                structuredData={productSchema}
            />
            <div className="pd-section">
            <div className="product-detail-page">
                {/* Breadcrumb */}
                <nav className="pd-breadcrumb reveal">
                    <Link to="/">{t('home')}</Link>
                    <span>/</span>
                    <Link to="/products">{t('products')}</Link>
                    <span>/</span>
                    <span>{product.title}</span>
                </nav>

                {/* Main content */}
                <div className="pd-main">
                    <div className="pd-image-wrap reveal reveal-delay-1">
                        <img src={product.image} alt={product.title} />
                    </div>

                    <div className="pd-info reveal reveal-delay-2">
                        <h1>{product.title}</h1>
                        <p className="pd-description">{product.description}</p>

                        <div className="pd-actions">
                            <button
                                className="btn-primary pd-cta"
                                onClick={() => setIsModalOpen(true)}
                            >
                                {t('get_price')}
                            </button>
                            <Link to="/contact" className="pd-contact-link">
                                {t('contactBtn')}
                            </Link>
                        </div>

                        <div className="pd-quote">
                            <QuoteButton product={product} />
                        </div>

                        <div className="pd-badges">
                            <span>{t('about_benefit_1')}</span>
                            <span>{t('about_benefit_3')}</span>
                            <span>{t('about_benefit_4')}</span>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div className="pd-related reveal">
                        <h2>{t('related_products')}</h2>
                        <div
                            className="pd-related-grid"
                            ref={relatedRef}
                            onScroll={handleRelatedScroll}
                        >
                            {related.map((p, index) => (
                                <Link key={p.slug} to={`/products/${p.slug}`} className={`pd-related-card reveal reveal-delay-${index + 1}`}>
                                    <div className="pd-related-image">
                                        <img src={p.image} alt={p.title} loading="lazy" />
                                    </div>
                                    <div className="pd-related-info">
                                        <h3>{p.title}</h3>
                                        <p>{p.description}</p>
                                        <span className="pd-related-link">
                                            {t('read_more')} →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* Progress bar — visible on mobile only */}
                        <div className="pd-related-progress-container">
                            <div
                                className="pd-related-progress-bar"
                                style={{ width: `${Math.min(100, relatedProgress)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
            </div>

            <PriceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productTitle={product.title}
                addToast={addToast}
            />
        </Layout>
    );
};

export default ProductDetail;
