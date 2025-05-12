import { useState } from 'react';

import { Code, Group } from '@mantine/core';
import classes from '../styles/ProtectedLayout.module.css';
import { HiDocument, HiLocationMarker, HiLogout } from 'react-icons/hi';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import useAuthStore from '../store/auth.store';

const data = [
    { link: 'image-upload', label: 'Upload ảnh', icon: HiDocument },
    { link: 'lat-lon-picker', label: 'Chọn vị trí', icon: HiLocationMarker },

];

const ProtectedLayout = () => {
    const { logout, isAuthenticated } = useAuthStore((state) => state);
    const navigate = useNavigate();
    const pathname = useLocation().pathname;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    const [active, setActive] = useState(pathname.split('/')[2] || 'image-upload');

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.link === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.link);
                navigate(item.link);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <div className='flex relative'>
            <nav className={classes.navbar}>
                <div className={classes.navbarMain}>
                    <Group className={classes.header} justify="space-between">
                        <Code fw={700}>Make with 💌 by tctoan1024</Code>
                    </Group>
                    {links}
                </div>

                <div className={classes.footer}>


                    <a href="#" className={classes.link} onClick={(event) => {
                        event.preventDefault();
                        logout();
                        navigate('/login');
                    }}>
                        <HiLogout className={classes.linkIcon} stroke={1.5} />
                        <span>Đăng xuất</span>
                    </a>
                </div>
            </nav>
            <div className='h-[100vh] overflow-auto w-full'>
                <Outlet />

            </div>
        </div>
    );
}

export default ProtectedLayout;