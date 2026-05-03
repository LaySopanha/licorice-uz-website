import {
    collection, doc, getDocs, getDoc,
    setDoc, updateDoc, deleteDoc, writeBatch,
    query, orderBy, addDoc, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from './config';

// ─── Seed data (used on first-run admin seeding) ────────────────────────────

export const SEED_PRODUCTS = [
    {
        id: 1, slug: 'fingers-a', order: 1, featured: true,
        image: '/images-new/product-1.jpg',
        title_ru: 'Бочонок A', title_en: 'Fingers A',
        desc_ru: 'Корень солодки, нарезанный на отрезки длиной 5-8 см, отборная резка по размеру (диаметр A — большой).',
        desc_en: 'Licorice root cut into 5-8 cm lengths, selected cut by size (diameter A — large).',
    },
    {
        id: 2, slug: 'fingers-peeled-mix', order: 2, featured: false,
        image: '/images-new/product-2.jpg',
        title_ru: 'Бочонок очищенный mix', title_en: 'Fingers Peeled mix',
        desc_ru: 'Очищенный корень солодки, нарезанный на отрезки длиной 5-8 см, смешанная фракция.',
        desc_en: 'Peeled licorice root cut into 5-8 cm lengths, mixed sizes.',
    },
    {
        id: 3, slug: 'granules', order: 3, featured: true,
        image: '/images-new/product-3.jpg',
        title_ru: 'Гранулы', title_en: 'Granules',
        desc_ru: 'Корень солодки в гранулированной нарезке.',
        desc_en: 'Licorice root cut into granules.',
    },
    {
        id: 4, slug: 'crushed', order: 4, featured: false,
        image: '/images-new/product-4.jpg',
        title_ru: 'Измельчённый', title_en: 'Crushed',
        desc_ru: 'Корень солодки измельчённый, смешанный помол.',
        desc_en: 'Crushed licorice root, mixed grind.',
    },
    {
        id: 5, slug: 'standard-sticks', order: 5, featured: false,
        image: '/images-new/product-5.jpg',
        title_ru: 'Палочки отборные стд', title_en: 'Standard Caliber Sticks',
        desc_ru: 'Корень солодки нарезки стандартного калибра.',
        desc_en: 'Licorice root cut into sticks of standard calibre.',
    },
    {
        id: 6, slug: 'selected-sticks', order: 6, featured: false,
        image: '/images-new/product-6.jpg',
        title_ru: 'Палочки отборные', title_en: 'Selected Sticks',
        desc_ru: 'Корень солодки нарезанный палочками, отборные по размеру.',
        desc_en: 'Licorice root cut into sticks selected by size.',
    },
    {
        id: 7, slug: 'peeled-sticks', order: 7, featured: false,
        image: '/images-new/product-7.jpg',
        title_ru: 'Палочки очищенные', title_en: 'Peeled Sticks',
        desc_ru: 'Очищенный корень солодки в палочках.',
        desc_en: 'Peeled licorice root cut into sticks.',
    },
    {
        id: 8, slug: 'powder', order: 8, featured: true,
        image: '/images-new/product-8.jpg',
        title_ru: 'Порошок', title_en: 'Powder',
        desc_ru: 'Корень солодки полу-мелкого помола, порошкообразный.',
        desc_en: 'Licorice root semi-fine grind, powdered.',
    },
    {
        id: 9, slug: 'slice-a', order: 9, featured: false,
        image: '/images-new/product-9.jpg',
        title_ru: 'Слайс A', title_en: 'Slice A',
        desc_ru: 'Корень солодки резаный, отборные срезы по размеру (диаметр A — большой).',
        desc_en: 'Sliced licorice root, selected slices by size (diameter A — large).',
    },
    {
        id: 10, slug: 'slice-mix', order: 10, featured: false,
        image: '/images-new/product-10.jpg',
        title_ru: 'Слайс mix', title_en: 'Slice Mix',
        desc_ru: 'Корень солодки резаный, смешанная фракция.',
        desc_en: 'Sliced licorice root, mixed fraction.',
    },
    {
        id: 11, slug: 'tablet-a', order: 11, featured: false,
        image: '/images-new/product-11.jpg',
        title_ru: 'Таблетка A', title_en: 'Tablet A',
        desc_ru: 'Корень солодки нарезанный таблеткой, отборное по размеру (диаметр A — большой).',
        desc_en: 'Licorice root cut into tablets, selected by size (diameter A — large).',
    },
    {
        id: 13, slug: 'tablet-mix', order: 12, featured: false,
        image: '/images-new/product-13.jpg',
        title_ru: 'Таблетка mix', title_en: 'Tablet Mix',
        desc_ru: 'Корень солодки нарезанный вертикально, смешанные размеры.',
        desc_en: 'Licorice root cut vertically, mixed sizes.',
    },
    {
        id: 14, slug: 'chips', order: 13, featured: false,
        image: '/images-new/product-14.jpg',
        title_ru: 'Щепки', title_en: 'Chips',
        desc_ru: 'Корень солодки дроблённый в виде щепки.',
        desc_en: 'Crushed licorice root in chip form.',
    },
    {
        id: 15, slug: 'custom-order', order: 14, featured: false,
        image: '/images-new/product-15.jpg',
        title_ru: 'Индивидуальный заказ', title_en: 'Custom Order',
        desc_ru: 'Производство и поставка корня солодки по индивидуальным требованиям.',
        desc_en: 'Production and supply of licorice root according to individual requirements.',
    },
    {
        id: 16, slug: 'extract', order: 15, featured: true,
        image: '/images-new/product-16.png',
        title_ru: 'Экстракт корня солодки', title_en: 'Licorice Root Extract',
        desc_ru: 'Экстракт корня солодки в порошкообразной и жидкой форме.',
        desc_en: 'Licorice root extract in powdered and liquid form.',
    },
];

export const SEED_SETTINGS = {
    hero_title_ru: 'Экспортёр солодки\nдля B2B-клиентов',
    hero_title_en: 'Licorice Exporter\nfor B2B Clients',
    hero_subtitle_ru: 'Объёмы поставок, рынки, ключевые преимущества',
    hero_subtitle_en: 'Supply volumes, markets, key advantages',
    hero_cta_ru: 'Запросить коммерческое предложение',
    hero_cta_en: 'Request Commercial Proposal',
    email: 'bogotmaster@gmail.com',
    phone: ['+998 97 712 98 26', '+998 99 512 98 26'],
    address_ru: '220204, Боготский район, Хорезмская область, Республика Узбекистан.',
    address_en: '220204, Bogot district, Khorezm region, Republic of Uzbekistan.',
    website: 'https://bogotmaster.org',
    website_display: 'bogotmaster.org',
    whatsapp: '998995129826',
    telegram: 'e_f_r_u_z_0_0_2_6',
    gallery: Array.from({ length: 14 }, (_, i) => `/gallary photos/${i}.jpg`),
};

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts() {
    const q = query(collection(db, 'products'), orderBy('order'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), docId: d.id }));
}

export async function fetchProductBySlug(slug) {
    const ref = doc(db, 'products', slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { ...snap.data(), docId: snap.id };
}

export async function saveProduct(product) {
    const ref = doc(db, 'products', product.slug);
    await setDoc(ref, product, { merge: true });
}

export async function deleteProduct(slug) {
    await deleteDoc(doc(db, 'products', slug));
}

// ─── Settings ────────────────────────────────────────────────────────────────

export async function fetchSettings() {
    const ref = doc(db, 'settings', 'main');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data();
}

export async function saveSettings(data) {
    const ref = doc(db, 'settings', 'main');
    await setDoc(ref, data, { merge: true });
}

// ─── Seed ────────────────────────────────────────────────────────────────────

export async function seedDatabase() {
    const batch = writeBatch(db);

    SEED_PRODUCTS.forEach(product => {
        const ref = doc(db, 'products', product.slug);
        batch.set(ref, product);
    });

    const settingsRef = doc(db, 'settings', 'main');
    batch.set(settingsRef, SEED_SETTINGS);

    await batch.commit();
}

export async function isDatabaseSeeded() {
    const snap = await getDocs(collection(db, 'products'));
    return !snap.empty;
}

// ─── Inquiries ───────────────────────────────────────────────────────────────

export async function saveInquiry(data) {
    await addDoc(collection(db, 'inquiries'), {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
    });
}

export async function fetchInquiries() {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
}

export async function markInquiryRead(id) {
    await updateDoc(doc(db, 'inquiries', id), { read: true });
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function trackPageView(path) {
    try {
        const ref = doc(db, 'stats', 'pageviews');
        await setDoc(ref, {
            total: increment(1),
            [`paths.${path.replace(/\//g, '_').replace(/^_/, '') || 'home'}`]: increment(1),
        }, { merge: true });
    } catch { /* silent — don't break the app */ }
}

export async function fetchStats() {
    const ref = doc(db, 'stats', 'pageviews');
    const snap = await getDoc(ref);
    if (!snap.exists()) return { total: 0, paths: {} };
    const data = snap.data();
    return {
        total: data.total || 0,
        paths: data.paths || {},
    };
}
