import { useState, useEffect } from 'react';
import Router from 'next/router';
import Loader from './Loader';

const Layout = ({ children }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const endLoading = () => setLoading(false);

        Router.events.on('routeChangeStart', startLoading);
        Router.events.on('routeChangeComplete', endLoading);
        Router.events.on('routeChangeError', endLoading);

        return () => {
            Router.events.off('routeChangeStart', startLoading);
            Router.events.off('routeChangeComplete', endLoading);
            Router.events.off('routeChangeError', endLoading);
        };
    }, []);

    return (
        <div>
            {loading && <Loader />}
            {children}
        </div>
    );
};

export default Layout;
