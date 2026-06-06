import './Stats.css';
import { useLanguage } from '../context/LanguageContext';

const Stats = () => {
    const statsData = [
        {
            value: '10+',
            label_ru: 'Лет на рынке',
            label_en: 'Years on market'
        },
        {
            value: '1500',
            label_ru: 'Тонн ежегодно',
            label_en: 'Tons annually'
        },
        {
            value: '20+',
            label_ru: 'Специалистов',
            label_en: 'Experts'
        },
        {
            value: '50+',
            label_ru: 'B2B Клиентов',
            label_en: 'B2B Clients'
        }
    ];


    const { language } = useLanguage();

    return (
        <section className="stats-section reveal">
            <div className="stats-container">
                {statsData.map((stat, index) => (
                    <div key={index} className={`stat-item reveal reveal-delay-${index + 1}`}>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">
                            {language === 'ru' ? stat.label_ru : stat.label_en}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
