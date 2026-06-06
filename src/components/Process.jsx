import './Process.css';
import { useLanguage } from '../context/LanguageContext';

const HarvestingIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.3C18.4 17 17 18.5 11 20z" />
        <path d="M7 20l4-4" />
        <path d="M15 13l-3-3" />
    </svg>
);

const ProcessingIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="M4.93 19.07l2.83-2.83" />
        <path d="M16.24 7.76l2.83-2.83" />
    </svg>
);

const QCIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
);

const ExportIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const Process = () => {
    const { language } = useLanguage();

    const steps = [
        {
            icon: <HarvestingIcon />,
            ru: {
                title: 'Заготовка',
                desc: 'Тщательный отбор корней солодки в экологически чистых районах Узбекистана.'
            },
            en: {
                title: 'Harvesting',
                desc: 'Careful selection of licorice roots in ecologically clean regions of Uzbekistan.'
            }
        },
        {
            icon: <ProcessingIcon />,
            ru: {
                title: 'Переработка',
                desc: 'Современные технологии очистки, сушки и нарезки по международным стандартам.'
            },
            en: {
                title: 'Processing',
                desc: 'Modern cleaning, drying, and cutting technologies according to international standards.'
            }
        },
        {
            icon: <QCIcon />,
            ru: {
                title: 'Контроль качества',
                desc: 'Многоэтапная проверка каждой партии продукции перед упаковкой.'
            },
            en: {
                title: 'Quality Control',
                desc: 'Multi-stage verification of each batch of products before packaging.'
            }
        },
        {
            icon: <ExportIcon />,
            ru: {
                title: 'Экспорт',
                desc: 'Надежная логистика и доставка продукции B2B клиентам по всему миру.'
            },
            en: {
                title: 'Export',
                desc: 'Reliable logistics and delivery of products to B2B clients worldwide.'
            }
        }
    ];

    return (
        <section className="process-section reveal">
            <div className="process-container">
                <div className="process-header">
                    <h2>{language === 'ru' ? 'Наш процесс' : 'Our Process'}</h2>
                    <p>{language === 'ru' ? 'Как мы обеспечиваем высшее качество нашей продукции' : 'How we ensure the highest quality of our products'}</p>
                </div>
                <div className="process-steps">
                    {steps.map((step, index) => (
                        <div key={index} className={`process-step reveal reveal-delay-${index + 1}`}>
                            <div className="step-icon-wrap">
                                <div className="step-icon">{step.icon}</div>
                                {index < steps.length - 1 && <div className="step-line"></div>}
                            </div>
                            <h3>{language === 'ru' ? step.ru.title : step.en.title}</h3>
                            <p>{language === 'ru' ? step.ru.desc : step.en.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
