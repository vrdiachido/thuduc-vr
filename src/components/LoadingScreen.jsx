import React from 'react';
import logo from '../assets/logo.png'; // Adjust path as needed based on where your logo is stored

const LoadingScreen = ({ isLoading }) => {
    return (
        <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-500 ease-in-out ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center">
                <img src={logo} alt="Logo" className="w-64 md:w-80 animate-pulse" />
                <div className="mt-8">
                    <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
