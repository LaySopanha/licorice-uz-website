import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PriceModal from '../components/PriceModal';
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
                <ProductDetailSkeleton />
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
                        <div className="pd-related-grid">
                            {related.map((p, index) => (
                                <Link key={p.slug} to={`/products/${p.slug}`} className={`pd-related-card reveal reveal-delay-${index + 1}`}>
                                    <div className="pd-related-image">
                                        <img src={p.image} alt={p.title} loading="lazy" />
                                    </div>
                                    <p>{p.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
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
