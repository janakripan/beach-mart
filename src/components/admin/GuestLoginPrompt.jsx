import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../pages/Auth/store/AuthStore';
import { X } from 'lucide-react';

const GuestLoginPrompt = () => {
    const [isVisible, setIsVisible] = useState(false);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // 1. Check if user is already logged in
        if (isAuthenticated) {
            setIsVisible(false);
            return;
        }

        // 2. Check if we are on the landing page
        if (location.pathname !== "/") {
            setIsVisible(false);
            return;
        }

        // 3. Check if prompt has been seen before
        const hasSeenPrompt = localStorage.getItem("guest_prompt_seen");
        if (!hasSeenPrompt) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated, location.pathname]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("guest_prompt_seen", "true");
    };

    const handleLogin = () => {
        handleDismiss(); // effectively "seen" it
        navigate('/signin');
    };

    if (!isVisible) return null;

    return (
        <div className="absolute  top-24 right-4 z-50 animate-in slide-in-from-right duration-500 fade-in">
            <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-5 max-w-sm w-full relative">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                >
                    <X size={16} />
                </button>

                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">Welcome to Beach Mart</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Sign in for the best experience, track orders, and exclusive offers.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={handleLogin}
                            className="flex-1 bg-black text-white hover:bg-gray-800 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="flex-1 bg-transparent border border-gray-300 hover:border-black hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium text-gray-700 transition-colors"
                        >
                            Continue as Guest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestLoginPrompt;
