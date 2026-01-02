import React, { useState } from 'react';
import './Contact.css';
import SocialButtons from './SocialButtons';
import { sendContactEmail, isEmailConfigured } from '../services/emailService';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите ваше имя';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
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
        // Clear submit status when user edits
        if (submitStatus) {
            setSubmitStatus(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Check if EmailJS is configured
            if (!isEmailConfigured()) {
                console.warn('EmailJS not configured. See src/services/emailService.js');
                // Simulate success for demo purposes
                await new Promise(resolve => setTimeout(resolve, 1000));
                setSubmitStatus('success');
            } else {
                // Send email via EmailJS
                const result = await sendContactEmail(formData);
                
                if (result.success) {
                    setSubmitStatus('success');
                } else {
                    throw new Error(result.message);
                }
            }

            // Reset form on success
            setFormData({
                name: '',
                email: '',
                message: ''
            });

        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="contact-section" id="contact">
            {/* CTA Banner */}
            <div className="contact-cta-wrapper">
                <div className="contact-cta">
                    <div className="contact-cta-content">
                        <h3>Вам нужна дополнительная информация?</h3>
                        <p>Напишите нам и наш специалист перезвонит вам.</p>
                    </div>
                    <button className="btn-cta">Написать</button>
                </div>
            </div>

            {/* Main Contact Content */}
            <div className="contact-container">
                {/* Left Column - Details */}
                <div className="contact-info">
                    <h2>Контакты</h2>

                    <div className="contact-details">
                        {/* Address */}
                        <div className="contact-item">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </div>
                            <div className="contact-text">
                                <h4>Адрес</h4>
                                <p>100154, Сергели Южная Промзона,<br />г.Ташкент, Республика Узбекистан.</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="contact-item">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                            </div>
                            <div className="contact-text">
                                <h4>Номер телефона</h4>
                                <p>+998 90 187 45 89</p>
                                <p>+998 71 256 34 12</p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="contact-item">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <div className="contact-text">
                                <h4>Почта</h4>
                                <p>glabra.uz@mail.ru</p>
                            </div>
                        </div>

                        {/* Site */}
                        <div className="contact-item">
                            <div className="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                                </svg>
                            </div>
                            <div className="contact-text">
                                <h4>Сайт</h4>
                                <p>http://licorice.uz</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Ф.И.О</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`form-input ${errors.name ? 'error' : ''}`}
                                placeholder="Иван Иванов*"
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Ваша почта</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="global.uz@gmail.com*"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Комментарий</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="form-textarea"
                                rows="4"
                            ></textarea>
                        </div>

                        {submitStatus === 'success' && (
                            <div className="success-message">
                                ✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="error-message-box">
                                ✗ Произошла ошибка. Попробуйте позже или свяжитесь с нами напрямую.
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Отправка...' : 'Отправить'}
                        </button>

                        <SocialButtons />
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
