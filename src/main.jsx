import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'
import { ContentProvider } from './context/ContentContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <LanguageProvider>
                    <ContentProvider>
                        <App />
                    </ContentProvider>
                </LanguageProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>,
)
