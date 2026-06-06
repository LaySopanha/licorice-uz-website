import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
        if (!pathname.startsWith('/admin')) {
            import('../firebase/firestore')
                .then(({ trackPageView }) => trackPageView(pathname))
                .catch(() => {});
        }
    }, [pathname]);
    return null;
}
