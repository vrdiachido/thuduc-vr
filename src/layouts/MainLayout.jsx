import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import data from '../assets/original_dataset.json';
import LoadingScreen from '../components/LoadingScreen';

const MainLayout = () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const root = document.querySelector('div[tdvlayer="content"]');
        if (!root) return;

        const buttons = root.querySelectorAll('div[tdvClass="Button"]');
        for (const btn of buttons) {
            const text = btn.textContent.replace(/\s+/g, ' ').trim();
            if (text === "YES") {
                btn.click();
                break;
            }
        }
    }, []);

    useEffect(() => {
        // Simulate loading data with minimum display time of 0.5 seconds
        const loadData = async () => {
            try {
                // If you have actual data loading, place it here
                // For example: await fetchData();

                // Ensure loading screen shows for at least 0.5 seconds
                await new Promise(resolve => setTimeout(resolve, 500));

                // When data is loaded, hide loading screen
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading data:", error);
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <>
            <LoadingScreen isLoading={isLoading} />
            <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <Outlet />
            </div>
        </>
    );
};

export default MainLayout;