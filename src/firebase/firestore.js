import {
    collection, doc, getDocs, getDoc,
    setDoc, updateDoc, deleteDoc, writeBatch,
    query, orderBy, addDoc, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from './config';

export { SEED_PRODUCTS, SEED_SETTINGS, SEED_TRANSLATIONS } from './seed';
import { SEED_PRODUCTS, SEED_SETTINGS, SEED_TRANSLATIONS } from './seed';


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

// ─── Translations ────────────────────────────────────────────────────────────

export async function fetchTranslations() {
    const ref = doc(db, 'settings', 'translations');
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data();
}

export async function saveTranslations(data) {
    const ref = doc(db, 'settings', 'translations');
    await setDoc(ref, data);
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

    const translationsRef = doc(db, 'settings', 'translations');
    batch.set(translationsRef, SEED_TRANSLATIONS);

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

export async function deleteInquiry(id) {
    await deleteDoc(doc(db, 'inquiries', id));
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export async function trackPageView(path) {
    const key = path.replace(/\//g, '_').replace(/\./g, '_').replace(/^_/, '') || 'home';
    const ref = doc(db, 'stats', 'pageviews');
    try {
        // updateDoc is the reliable way to atomically increment nested fields.
        // It correctly handles dot-notation field paths (paths.some_key).
        await updateDoc(ref, {
            total: increment(1),
            [`paths.${key}`]: increment(1),
        });
    } catch (err) {
        if (err.code === 'not-found') {
            // First ever page view — document doesn't exist yet, create it.
            try {
                await setDoc(ref, { total: 1, paths: { [key]: 1 } });
            } catch { /* silent */ }
        }
        // Other errors (offline, rules) are silently ignored so they
        // never break the user-facing app.
    }
}

export async function fetchStats() {
    try {
        const ref = doc(db, 'stats', 'pageviews');
        const snap = await getDoc(ref);
        if (!snap.exists()) return { total: 0, paths: {} };
        const data = snap.data();
        return {
            total: data.total || 0,
            paths: data.paths || {},
        };
    } catch {
        return { total: 0, paths: {} };
    }
}
