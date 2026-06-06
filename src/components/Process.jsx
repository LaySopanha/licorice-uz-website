import './Process.css';
import { useLanguage } from '../context/LanguageContext';

const Process = () => {
    const { language } = useLanguage();

    const steps = [
        {
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
                                <div className="step-icon">{index + 1}</div>
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
