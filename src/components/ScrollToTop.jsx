import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
        // Don't track admin visits. Import lazily so the Firebase SDK stays
        // off the initial critical path.
        if (!pathname.startsWith('/admin')) {
            import('../firebase/firestore').then(({ trackPageView }) => trackPageView(pathname));
        }
    }, [pathname]);
    return null;
}
