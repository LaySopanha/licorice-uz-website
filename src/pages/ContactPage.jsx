import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Contact from '../components/Contact';

import { useReveal } from '../hooks/useReveal';

const ContactPage = ({ addToast }) => {
    useReveal();
    return (
        <Layout>
            <SEO />
            <div style={{ paddingTop: '90px' }}>
                <Contact addToast={addToast} />
            </div>
        </Layout>
    );
};

export default ContactPage;
