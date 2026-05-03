import React, { useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import About from '../components/About';
import Certificates from '../components/Certificates';

const AboutPage = ({ addToast }) => {
    return (
        <Layout>
            <SEO />
            <div style={{ paddingTop: '90px' }}>
                <About />
                <Certificates />
            </div>
        </Layout>
    );
};

export default AboutPage;
