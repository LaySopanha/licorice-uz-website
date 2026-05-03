import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../firebase/firestore';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
        // Don't track admin visits
        if (!pathname.startsWith('/admin')) {
            trackPageView(pathname);
        }
    }, [pathname]);
    return null;
}
