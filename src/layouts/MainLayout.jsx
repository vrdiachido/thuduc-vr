import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import useAuthStore from '../store/auth.store';

const MainLayout = () => {
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        // Check if user is already logged in
        checkAuth();
    }, [checkAuth]);

    return (
        <Outlet />
    );
};

export default MainLayout;