import React, { useState } from 'react';
import './PriceModal.css';
import SocialButtons from './SocialButtons';
import { sendPriceInquiryEmail, isEmailConfigured } from '../services/emailService';

const PriceModal = ({ isOpen, onClose, productTitle, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        quantity: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите ваше имя';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите номер телефона';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
            newErrors.phone = 'Неверный формат телефона';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }

        if (!formData.quantity.trim()) {
            newErrors.quantity = 'Укажите количество';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Check if EmailJS is configured
            if (!isEmailConfigured()) {
                console.warn('EmailJS not configured. See src/services/emailService.js');
                // Simulate success for demo purposes
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                // Send email via EmailJS
                const result = await sendPriceInquiryEmail({
                    ...formData,
                    product: productTitle
                });
                
                if (!result.success) {
                    throw new Error(result.message);
                }
            }

            // Reset form
            setFormData({
                name: '',
                phone: '',
                email: '',
                quantity: '',
                message: ''
            });

            setSubmitStatus('success');
            
            // Close modal after showing success message
            setTimeout(() => {
                onClose();
                setSubmitStatus(null);
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="modal-header">
                    <h2>Запрос цены</h2>
                    <p className="modal-product">{productTitle}</p>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="modal-form-group">
                        <label>Ф.И.О *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`modal-input ${errors.name ? 'error' : ''}`}
                            placeholder="Иван Иванов"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="modal-form-row">
                        <div className="modal-form-group">
                            <label>Телефон *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`modal-input ${errors.phone ? 'error' : ''}`}
                                placeholder="+998 90 123 45 67"
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="modal-form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`modal-input ${errors.email ? 'error' : ''}`}
                                placeholder="example@mail.com"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="modal-form-group">
                        <label>Количество *</label>
                        <input
                            type="text"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            className={`modal-input ${errors.quantity ? 'error' : ''}`}
                            placeholder="Например: 100 кг, 1 тонна"
                        />
                        {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                    </div>

                    <div className="modal-form-group">
                        <label>Комментарий</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="modal-textarea"
                            placeholder="Дополнительная информация..."
                            rows="3"
                        />
                    </div>

                    {submitStatus === 'success' && (
                        <div className="modal-success-message">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Спасибо! Мы свяжемся с вами в ближайшее время.</span>
                        </div>
                    )}

                    {submitStatus === 'error' && (
                        <div className="modal-error-message">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Произошла ошибка. Попробуйте позже.</span>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        className="modal-submit-btn"
                        disabled={isSubmitting || submitStatus === 'success'}
                    >
                        {isSubmitting ? 'Отправка...' : 'Отправить запрос'}
                    </button>

                    <SocialButtons productName={productTitle} />
                </form>
            </div>
        </div>
    );
};

export default PriceModal;
