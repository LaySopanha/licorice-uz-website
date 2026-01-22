/**
 * Website Configuration
 * 
 * use this file to update the content of the website
 * 
 * 1. EmailJS Configuration:
 *    To change where emails are sent, you need to update these values.
 *    - Sign up/Login to https://dashboard.emailjs.com/
 *    - Service ID: Found in the "Email Services" tab
 *    - Template IDs: Found in the "Email Templates" tab
 *    - Public Key: Found in the "Account" (or "Integration") settings
 * 
 * 2. Contact Information:
 *    Update the details below to change what is displayed on the website.
 */

export const EMAILJS_CONFIG = {
    // Replace these with your Client's EmailJS credentials
    serviceId: 'service_5xfe9ip',
    contactTemplateId: 'template_dxtvhag',
    priceTemplateId: 'template_55wdrud',
    publicKey: 'j-s_YRlJGVFUiXKJp'
};

export const CONTACT_INFO = {
    email: 'glabra.uz@mail.ru',
    phone: [
        '+998 90 187 45 89',
        '+998 71 256 34 12'
    ],
    address: '100154, Сергели Южная Промзона, г.Ташкент, Республика Узбекистан.',
    address_lines: [
        '100154, Сергели Южная Промзона,',
        'г.Ташкент, Республика Узбекистан.'
    ],
    website: 'http://licorice.uz',
    website_display: 'licorice.uz',
    social: {
        whatsapp: '998901874589', // Phone number for WhatsApp (no + or spaces)
        telegram: 'licorice_uz'   // Telegram username (without @)
    }
};

export const COMPANY_INFO = {
    name: 'Feruz', // or Glabra, checking footer/logo
    // Add more if needed
};
