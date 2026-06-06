import {
    collection, doc, getDocs, getDoc,
    setDoc, updateDoc, deleteDoc, writeBatch,
    query, orderBy, addDoc, serverTimestamp, increment
} from 'firebase/firestore';
import { db } from './config';

// Seed data lives in a Firebase-free module so it can be used as a fallback
// without forcing the Firebase SDK into the initial bundle. Re-exported here
// for backwards compatibility with existing imports.
export { SEED_PRODUCTS, SEED_SETTINGS } from './seed';
import { SEED_PRODUCTS, SEED_SETTINGS } from './seed';


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
