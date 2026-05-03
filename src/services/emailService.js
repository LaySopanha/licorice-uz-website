import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config';
import { saveInquiry } from '../firebase/firestore';

const EMAIL_CONFIG = {
    ...EMAILJS_CONFIG,
    autoReplyTemplateId: import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID || '',
};

emailjs.init(EMAIL_CONFIG.publicKey);

const AUTO_REPLY_BODY = {
    ru: (name, product) =>
        `Здравствуйте, ${name}!\n\nСпасибо за ваш запрос${product ? ` по продукту «${product}»` : ''}.\nНаш специалист свяжется с вами в течение 24 часов.\n\nС уважением,\nКоманда Bogot Master`,
    en: (name, product) =>
        `Hello, ${name}!\n\nThank you for your inquiry${product ? ` regarding «${product}»` : ''}.\nOur specialist will contact you within 24 hours.\n\nBest regards,\nBogot Master Team`,
};

async function sendAutoReply(email, name, language = 'ru', product = '') {
    const templateId = EMAIL_CONFIG.autoReplyTemplateId;
    if (!templateId) return;
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, templateId, {
            to_email: email,
            to_name: name,
            message: AUTO_REPLY_BODY[language]?.(name, product) || AUTO_REPLY_BODY.ru(name, product),
            product_name: product,
        });
    } catch (err) {
        console.warn('Auto-reply failed:', err);
    }
}

export const sendContactEmail = async (formData, language = 'ru') => {
    try {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_name: 'Bogot Master',
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.contactTemplateId,
            templateParams
        );

        sendAutoReply(formData.email, formData.name, language);
        saveInquiry({ type: 'contact', name: formData.name, email: formData.email, message: formData.message });

        return { success: true, response };
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, message: error.text || 'Failed to send email', error };
    }
};

export const sendPriceInquiryEmail = async (formData, language = 'ru') => {
    try {
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone: formData.phone,
            product_name: formData.product,
            quantity: formData.quantity,
            message: formData.message || '—',
            to_name: 'Bogot Master',
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.priceTemplateId,
            templateParams
        );

        sendAutoReply(formData.email, formData.name, language, formData.product);
        saveInquiry({ type: 'price', name: formData.name, email: formData.email, phone: formData.phone, product: formData.product, quantity: formData.quantity, message: formData.message });

        return { success: true, response };
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, message: error.text || 'Failed to send email', error };
    }
};

export const isEmailConfigured = () =>
    EMAIL_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
    EMAIL_CONFIG.contactTemplateId !== 'YOUR_CONTACT_TEMPLATE_ID' &&
    EMAIL_CONFIG.priceTemplateId !== 'YOUR_PRICE_TEMPLATE_ID' &&
    EMAIL_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';
