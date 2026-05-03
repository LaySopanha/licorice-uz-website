import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { uploadProductImage, uploadGalleryImage } from '../../supabase/config';
import {
    fetchProducts, fetchSettings,
    saveProduct, saveSettings, deleteProduct,
    seedDatabase, isDatabaseSeeded,
    fetchInquiries, markInquiryRead,
    fetchStats,
} from '../../firebase/firestore';
import './Admin.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [tab, setTab] = useState('dashboard');
    const [settingsSubTab, setSettingsSubTab] = useState('hero');

    // Products state
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [productForm, setProductForm] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [productSaving, setProductSaving] = useState(false);

    // Settings state
    const [settings, setSettings] = useState({});
    const [settingsSaving, setSettingsSaving] = useState(false);

    // Inquiries state
    const [inquiries, setInquiries] = useState([]);
    const [expandedInquiry, setExpandedInquiry] = useState(null);

    // Stats state
    const [stats, setStats] = useState({ total: 0, paths: {} });

    // Gallery state
    const [gallery, setGallery] = useState([]);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [galleryUploading, setGalleryUploading] = useState(false);
    const galleryInputRef = useRef();

    // Seed state
    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState('');

    // Custom confirm state
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        isDanger: false
    });

    const [toast, setToast] = useState('');
    const fileInputRef = useRef();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (!user) navigate('/admin/login', { replace: true });
            else setUser(user);
            setAuthChecked(true);
        });
        return unsub;
    }, [navigate]);

    useEffect(() => {
        if (!user) return;
        loadData();
    }, [user]);

    const loadData = async () => {
        const [prods, sets, inqs, sts] = await Promise.all([
            fetchProducts(), fetchSettings(), fetchInquiries(), fetchStats()
        ]);
        setProducts(prods || []);
        setSettings(sets || {});
        setInquiries(inqs || []);
        setStats(sts || { total: 0, paths: {} });
        setGallery(sets?.gallery || []);
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // ── Products ──────────────────────────────────────────────────────────────

    const startEdit = (product) => {
        setEditingProduct(product.slug);
        setIsAdding(false);
        setProductForm({ ...product });
        setImageFile(null);
        setImagePreview(product.image);
    };

    const startAdd = () => {
        setIsAdding(true);
        setEditingProduct(null);
        setProductForm({
            slug: '',
            title_ru: '',
            title_en: '',
            desc_ru: '',
            desc_en: '',
            featured: false,
            order: products.length > 0 ? Math.max(...products.map(p => p.order || 0)) + 1 : 1,
            image: ''
        });
        setImageFile(null);
        setImagePreview('');
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setIsAdding(false);
        setProductForm({});
        setImageFile(null);
        setImagePreview('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const saveProductEdit = async () => {
        if (isAdding && !productForm.slug) {
            showToast('Slug is required for new products.');
            return;
        }

        if (isAdding && products.some(p => p.slug === productForm.slug)) {
            showToast('A product with this slug already exists.');
            return;
        }

        setProductSaving(true);
        try {
            let imageUrl = productForm.image;

            if (imageFile) {
                imageUrl = await uploadProductImage(productForm.slug, imageFile);
            } else if (isAdding && !imageUrl) {
                // If adding and no image, maybe use a placeholder
                imageUrl = '/images/placeholder.png';
            }

            const updated = { ...productForm, image: imageUrl };
            await saveProduct(updated);

            if (isAdding) {
                setProducts(prev => [...prev, updated].sort((a, b) => (a.order || 0) - (b.order || 0)));
            } else {
                setProducts(prev => prev.map(p => p.slug === updated.slug ? updated : p));
            }

            cancelEdit();
            showToast(isAdding ? 'Product added.' : 'Product saved.');
        } catch (err) {
            console.error(err);
            showToast('Error saving product.');
        } finally {
            setProductSaving(false);
        }
    };

    const handleDeleteProduct = async (slug) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Product',
            message: `Are you sure you want to delete "${slug}"? This action cannot be undone.`,
            isDanger: true,
            onConfirm: async () => {
                try {
                    await deleteProduct(slug);
                    setProducts(prev => prev.filter(p => p.slug !== slug));
                    showToast('Product deleted.');
                } catch (err) {
                    console.error(err);
                    showToast('Error deleting product.');
                }
            }
        });
    };

    const filteredProducts = products.filter(p =>
        p.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title_ru?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Settings ──────────────────────────────────────────────────────────────

    const handleSettingsChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handlePhoneChange = (index, value) => {
        const phones = [...(settings.phone || [])];
        phones[index] = value;
        setSettings(prev => ({ ...prev, phone: phones }));
    };

    const saveSettingsData = async () => {
        setSettingsSaving(true);
        try {
            await saveSettings(settings);
            showToast('Settings saved.');
        } catch {
            showToast('Error saving settings.');
        } finally {
            setSettingsSaving(false);
        }
    };

    // ── Inquiries ─────────────────────────────────────────────────────────────

    const handleMarkRead = async (id) => {
        await markInquiryRead(id);
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
    };

    const unreadCount = inquiries.filter(i => !i.read).length;

    // ── Gallery ───────────────────────────────────────────────────────────────

    const handleGalleryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setGalleryUploading(true);
        try {
            const url = await uploadGalleryImage(file);
            const updated = [...gallery, url];
            setGallery(updated);
            await saveSettings({ ...settings, gallery: updated });
            showToast('Image uploaded and added to gallery.');
        } catch (err) {
            console.error('Upload Error:', err);
            showToast(`Error: ${err.message || 'Error uploading image.'}`);
        } finally {
            setGalleryUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const removeGalleryImage = async (index) => {
        if (!window.confirm('Remove this image from gallery?')) return;
        const updated = gallery.filter((_, i) => i !== index);
        setGallery(updated);
        await saveSettings({ ...settings, gallery: updated });
        showToast('Image removed.');
    };

    // ── Seed ──────────────────────────────────────────────────────────────────

    const handleSeed = async () => {
        const seeded = await isDatabaseSeeded();
        if (seeded) {
            setSeedMsg('Database already has data. Seeding would overwrite it.');
            return;
        }
        setSeeding(true);
        try {
            await seedDatabase();
            await loadData();
            showToast('Database seeded from defaults.');
            setSeedMsg('');
        } catch {
            showToast('Seed failed.');
        } finally {
            setSeeding(false);
        }
    };

    const forceSeed = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'Re-seed Database',
            message: 'This will overwrite all current data with defaults. Continue?',
            isDanger: true,
            onConfirm: async () => {
                setSeeding(true);
                try {
                    await seedDatabase();
                    await loadData();
                    showToast('Database re-seeded.');
                    setSeedMsg('');
                } catch {
                    showToast('Seed failed.');
                } finally {
                    setSeeding(false);
                }
            }
        });
    };

    if (!authChecked) return null;

    return (
        <div className="admin-dashboard">
            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-confirm-modal">
                        <h3>{confirmModal.title}</h3>
                        <p>{confirmModal.message}</p>
                        <div className="admin-confirm-actions">
                            <button 
                                className="admin-btn-secondary" 
                                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                            >
                                Cancel
                            </button>
                            <button 
                                className={confirmModal.isDanger ? 'admin-btn-danger' : 'admin-btn-primary'}
                                onClick={() => {
                                    confirmModal.onConfirm();
                                    setConfirmModal({ ...confirmModal, isOpen: false });
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <img src="/images/B5-logo.png" alt="Bogot Master" className="admin-logo-sm" />
                    <span>Admin Panel</span>
                </div>
                <button
                    className="admin-btn-secondary"
                    onClick={() => signOut(auth)}
                >
                    Sign Out
                </button>
            </header>

            {/* Toast */}
            {toast && <div className="admin-toast">{toast}</div>}

            <div className="admin-body">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-sidebar-menu">
                        <button
                            className={`admin-tab-btn ${tab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setTab('dashboard')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            <span>Dashboard</span>
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'products' ? 'active' : ''}`}
                            onClick={() => setTab('products')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            <span>Products</span>
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'inquiries' ? 'active' : ''}`}
                            onClick={() => setTab('inquiries')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <span>Inquiries</span> {unreadCount > 0 && <span className="admin-unread-badge">{unreadCount}</span>}
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'stats' ? 'active' : ''}`}
                            onClick={() => setTab('stats')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                            <span>Stats</span>
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'gallery' ? 'active' : ''}`}
                            onClick={() => setTab('gallery')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <span>Gallery</span>
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'settings' ? 'active' : ''}`}
                            onClick={() => setTab('settings')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            <span>Settings</span>
                        </button>
                        <button
                            className={`admin-tab-btn ${tab === 'seed' ? 'active' : ''}`}
                            onClick={() => setTab('seed')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                            <span>Database</span>
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="admin-main">

                    {/* ── Dashboard tab ─────────────────────────────────────────── */}
                    {tab === 'dashboard' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Dashboard Overview</h2>
                            </div>
                            <div className="admin-stats-grid">
                                <div className="admin-stat-card">
                                    <span className="admin-stat-label">Total Products</span>
                                    <span className="admin-stat-value">{products.length}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span className="admin-stat-label">Featured Items</span>
                                    <span className="admin-stat-value">{products.filter(p => p.featured).length}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span className="admin-stat-label">New Inquiries</span>
                                    <span className="admin-stat-value">{unreadCount}</span>
                                </div>
                                <div className="admin-stat-card">
                                    <span className="admin-stat-label">Total Visits</span>
                                    <span className="admin-stat-value">{stats.total}</span>
                                </div>
                            </div>
                            
                            <div className="admin-dashboard-welcome">
                                <h3 className="admin-sub-heading">Quick Actions</h3>
                                <div className="admin-product-row-actions" style={{marginTop: '20px'}}>
                                    <button className="admin-btn-primary" onClick={() => setTab('products')}>Manage Products</button>
                                    <button className="admin-btn-secondary" onClick={() => setTab('inquiries')}>View Inquiries</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Products tab ──────────────────────────────────────────── */}
                    {tab === 'products' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Products <span className="admin-count">({products.length})</span></h2>
                                {!editingProduct && !isAdding && (
                                    <button className="admin-btn-primary" onClick={startAdd}>
                                        + Add Product
                                    </button>
                                )}
                            </div>

                            {(editingProduct || isAdding) ? (
                                <div className="admin-edit-form">
                                    <div className="admin-form-header">
                                        <h3>{isAdding ? 'New Product' : `Editing: ${productForm.title_en}`}</h3>
                                        <button className="admin-btn-close" onClick={cancelEdit}>&times;</button>
                                    </div>

                                    <div className="admin-edit-image">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="preview" />
                                        ) : (
                                            <div className="admin-image-placeholder">No Image</div>
                                        )}
                                        <div className="admin-edit-image-actions">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                style={{ display: 'none' }}
                                                onChange={handleImageChange}
                                            />
                                            <button
                                                className="admin-btn-secondary"
                                                onClick={() => fileInputRef.current.click()}
                                            >
                                                {imagePreview ? 'Change Image' : 'Upload Image'}
                                            </button>
                                            {imageFile && <span className="admin-filename">{imageFile.name}</span>}
                                        </div>
                                    </div>

                                    <div className="admin-fields-row">
                                        <div className="admin-field">
                                            <label>Slug (URL name, immutable after save)</label>
                                            <input
                                                value={productForm.slug || ''}
                                                onChange={e => setProductForm(p => ({ ...p, slug: e.target.value }))}
                                                disabled={!isAdding}
                                                placeholder="e.g. licorice-root"
                                            />
                                        </div>
                                        <div className="admin-field">
                                            <label>Display Order</label>
                                            <input
                                                type="number"
                                                value={productForm.order || ''}
                                                onChange={e => setProductForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-fields-row">
                                        <div className="admin-field">
                                            <label>Title (Russian)</label>
                                            <input
                                                value={productForm.title_ru || ''}
                                                onChange={e => setProductForm(p => ({ ...p, title_ru: e.target.value }))}
                                            />
                                        </div>
                                        <div className="admin-field">
                                            <label>Title (English)</label>
                                            <input
                                                value={productForm.title_en || ''}
                                                onChange={e => setProductForm(p => ({ ...p, title_en: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-fields-row">
                                        <div className="admin-field">
                                            <label>Description (Russian)</label>
                                            <textarea
                                                rows={4}
                                                value={productForm.desc_ru || ''}
                                                onChange={e => setProductForm(p => ({ ...p, desc_ru: e.target.value }))}
                                            />
                                        </div>
                                        <div className="admin-field">
                                            <label>Description (English)</label>
                                            <textarea
                                                rows={4}
                                                value={productForm.desc_en || ''}
                                                onChange={e => setProductForm(p => ({ ...p, desc_en: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-field-inline">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!productForm.featured}
                                                onChange={e => setProductForm(p => ({ ...p, featured: e.target.checked }))}
                                            />
                                            Show on Home page (featured)
                                        </label>
                                    </div>

                                    <div className="admin-edit-actions">
                                        <button
                                            className="admin-btn-primary"
                                            onClick={saveProductEdit}
                                            disabled={productSaving}
                                        >
                                            {productSaving ? 'Saving…' : (isAdding ? 'Add Product' : 'Save Changes')}
                                        </button>
                                        <button className="admin-btn-secondary" onClick={cancelEdit}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="admin-list-controls">
                                        <div className="admin-search">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-products-list">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map(product => (
                                                <div key={product.slug} className="admin-product-row">
                                                    <img src={product.image} alt={product.title_en} />
                                                    <div className="admin-product-row-info">
                                                        <div className="admin-product-row-main">
                                                            <strong>{product.title_en}</strong>
                                                            {product.featured && (
                                                                <span className="admin-badge-featured">
                                                                    Featured Item
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="admin-product-slug">{product.slug}</span>
                                                        <span className="admin-product-ru">{product.title_ru}</span>
                                                    </div>
                                                    <div className="admin-product-row-actions">
                                                        <button
                                                            className="admin-btn-secondary admin-btn-sm"
                                                            onClick={() => startEdit(product)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="admin-btn-danger admin-btn-sm"
                                                            onClick={() => handleDeleteProduct(product.slug)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="admin-empty-state">
                                                No products found.
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ── Inquiries tab ─────────────────────────────────────────── */}
                    {tab === 'inquiries' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Inquiries <span className="admin-count">({inquiries.length} total{unreadCount > 0 ? `, ${unreadCount} unread` : ''})</span></h2>
                            </div>
                            {inquiries.length === 0 ? (
                                <div className="admin-empty-state">No inquiries yet. They'll appear here when visitors submit forms.</div>
                            ) : (
                                <div className="admin-inquiries-list">
                                    {inquiries.map(inq => (
                                        <div key={inq.id} className={`admin-inquiry-row ${!inq.read ? 'unread' : ''}`}>
                                            <div className="admin-inquiry-top" onClick={() => setExpandedInquiry(expandedInquiry === inq.id ? null : inq.id)}>
                                                <span className={`admin-inq-type ${inq.type || 'contact'}`}>{inq.type === 'price' ? 'Price Request' : 'Contact'}</span>
                                                <div className="admin-inquiry-info">
                                                    <strong>{inq.name}</strong>
                                                    <span className="admin-inq-email">{inq.email}</span>
                                                </div>
                                                {inq.product && <span className="admin-inq-product">{inq.product}</span>}
                                                <div className="admin-inq-date">
                                                    {inq.createdAt?.toDate?.()?.toLocaleDateString() || inq.timestamp?.toDate?.()?.toLocaleDateString() || '—'}
                                                </div>
                                                {!inq.read && <div className="admin-unread-dot" />}
                                                <button className="admin-btn-secondary admin-btn-sm" onClick={(e) => { e.stopPropagation(); setExpandedInquiry(expandedInquiry === inq.id ? null : inq.id); }}>
                                                    {expandedInquiry === inq.id ? 'Close' : 'View'}
                                                </button>
                                            </div>
                                            {expandedInquiry === inq.id && (
                                                <div className="admin-inquiry-detail">
                                                    {inq.phone && <p><strong>Phone:</strong> {inq.phone}</p>}
                                                    {inq.quantity && <p><strong>Quantity:</strong> {inq.quantity}</p>}
                                                    {inq.subject && <p><strong>Subject:</strong> {inq.subject}</p>}
                                                    {inq.message && (
                                                        <div className="admin-inquiry-msg">
                                                            <strong>Message:</strong><br/>
                                                            {inq.message}
                                                        </div>
                                                    )}
                                                    <div className="admin-inquiry-actions">
                                                        <a href={`mailto:${inq.email}`} className="admin-btn-primary admin-btn-sm" style={{textDecoration: 'none'}}>Reply by Email</a>
                                                        {!inq.read && (
                                                            <button className="admin-btn-secondary admin-btn-sm" onClick={() => handleMarkRead(inq.id)}>Mark as Read</button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Stats tab ─────────────────────────────────────────────── */}
                    {tab === 'stats' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Visitor Stats</h2>
                            </div>
                            <div className="admin-stats-total">
                                <span className="admin-stats-number">{stats.total.toLocaleString()}</span>
                                <span className="admin-stats-label">Total Page Views</span>
                            </div>
                            <h3 className="admin-sub-heading">By Page</h3>
                            <div className="admin-stats-table">
                                {Object.entries(stats.paths || {})
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([path, count]) => {
                                        const label = path === 'home' ? '/' : '/' + path.replace(/_/g, '/');
                                        const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                                        return (
                                            <div key={path} className="admin-stats-row">
                                                <span className="admin-stats-path">{label}</span>
                                                <div className="admin-stats-bar-wrap">
                                                    <div className="admin-stats-bar" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="admin-stats-count">{count.toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {/* ── Gallery tab ───────────────────────────────────────────── */}
                    {tab === 'gallery' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Gallery <span className="admin-count">({gallery.length} images)</span></h2>
                            </div>
                            <div className="admin-gallery-add">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={galleryInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleGalleryUpload}
                                />
                                <button 
                                    className="admin-btn-primary" 
                                    onClick={() => galleryInputRef.current.click()}
                                    disabled={galleryUploading}
                                >
                                    {galleryUploading ? 'Uploading...' : 'Upload New Image'}
                                </button>
                                <p className="admin-help-text" style={{margin: '0', fontSize: '0.8rem'}}>
                                    Tip: Uploaded images are automatically saved to your website gallery.
                                </p>
                            </div>
                            <div className="admin-gallery-grid">
                                {gallery.map((src, i) => (
                                    <div key={i} className="admin-gallery-item">
                                        <img src={src} alt={`Gallery ${i + 1}`} />
                                        <button
                                            className="admin-gallery-remove"
                                            onClick={() => removeGalleryImage(i)}
                                            title="Remove"
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Settings tab ──────────────────────────────────────────── */}
                    {tab === 'settings' && (
                        <div className="admin-section">
                            <div className="admin-section-header">
                                <h2>Settings</h2>
                                <button
                                    className="admin-btn-primary"
                                    onClick={saveSettingsData}
                                    disabled={settingsSaving}
                                >
                                    {settingsSaving ? 'Saving…' : 'Save All Settings'}
                                </button>
                            </div>

                            <div className="admin-sub-tabs">
                                <button
                                    className={`admin-sub-tab ${settingsSubTab === 'hero' ? 'active' : ''}`}
                                    onClick={() => setSettingsSubTab('hero')}
                                >
                                    Hero Section
                                </button>
                                <button
                                    className={`admin-sub-tab ${settingsSubTab === 'contact' ? 'active' : ''}`}
                                    onClick={() => setSettingsSubTab('contact')}
                                >
                                    Contact & Socials
                                </button>
                            </div>

                            <div className="admin-sub-tab-content">
                                {settingsSubTab === 'hero' && (
                                    <div className="admin-form-group">
                                        <h3 className="admin-sub-heading">Hero Content</h3>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>Hero Title (Russian)</label>
                                                <textarea
                                                    rows={2}
                                                    value={settings.hero_title_ru || ''}
                                                    onChange={e => handleSettingsChange('hero_title_ru', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Hero Title (English)</label>
                                                <textarea
                                                    rows={2}
                                                    value={settings.hero_title_en || ''}
                                                    onChange={e => handleSettingsChange('hero_title_en', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>Hero Subtitle (Russian)</label>
                                                <input
                                                    value={settings.hero_subtitle_ru || ''}
                                                    onChange={e => handleSettingsChange('hero_subtitle_ru', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Hero Subtitle (English)</label>
                                                <input
                                                    value={settings.hero_subtitle_en || ''}
                                                    onChange={e => handleSettingsChange('hero_subtitle_en', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>CTA Button (Russian)</label>
                                                <input
                                                    value={settings.hero_cta_ru || ''}
                                                    onChange={e => handleSettingsChange('hero_cta_ru', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>CTA Button (English)</label>
                                                <input
                                                    value={settings.hero_cta_en || ''}
                                                    onChange={e => handleSettingsChange('hero_cta_en', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settingsSubTab === 'contact' && (
                                    <div className="admin-form-group">
                                        <h3 className="admin-sub-heading">Communication</h3>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>Email</label>
                                                <input
                                                    value={settings.email || ''}
                                                    onChange={e => handleSettingsChange('email', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Website</label>
                                                <input
                                                    value={settings.website || ''}
                                                    onChange={e => handleSettingsChange('website', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>Phone 1</label>
                                                <input
                                                    value={(settings.phone || [])[0] || ''}
                                                    onChange={e => handlePhoneChange(0, e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Phone 2</label>
                                                <input
                                                    value={(settings.phone || [])[1] || ''}
                                                    onChange={e => handlePhoneChange(1, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>Address (Russian)</label>
                                                <textarea
                                                    rows={2}
                                                    value={settings.address_ru || ''}
                                                    onChange={e => handleSettingsChange('address_ru', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Address (English)</label>
                                                <textarea
                                                    rows={2}
                                                    value={settings.address_en || ''}
                                                    onChange={e => handleSettingsChange('address_en', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <h3 className="admin-sub-heading">Social Links</h3>
                                        <div className="admin-fields-row">
                                            <div className="admin-field">
                                                <label>WhatsApp number (no + or spaces)</label>
                                                <input
                                                    value={settings.whatsapp || ''}
                                                    onChange={e => handleSettingsChange('whatsapp', e.target.value)}
                                                />
                                            </div>
                                            <div className="admin-field">
                                                <label>Telegram username (no @)</label>
                                                <input
                                                    value={settings.telegram || ''}
                                                    onChange={e => handleSettingsChange('telegram', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Database / seed tab ───────────────────────────────────── */}
                    {tab === 'seed' && (
                        <div className="admin-section">
                            <h2>Database</h2>
                            <p className="admin-help-text">
                                Use these tools to populate Firestore for the first time, or to reset all content back to the built-in defaults.
                            </p>
                            <div className="admin-seed-actions">
                                <button
                                    className="admin-btn-primary"
                                    onClick={handleSeed}
                                    disabled={seeding}
                                >
                                    {seeding ? 'Seeding…' : 'Seed from defaults (skip if data exists)'}
                                </button>
                                <button
                                    className="admin-btn-danger"
                                    onClick={forceSeed}
                                    disabled={seeding}
                                >
                                    Force re-seed (overwrites all data)
                                </button>
                            </div>
                            {seedMsg && <p className="admin-seed-msg">{seedMsg}</p>}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
