import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ShoppingBag } from 'lucide-react';

const GuestCheckoutModal = ({ isOpen, onClose, onContinueAsGuest }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSignIn = () => {
        onClose();
        navigate('/signin');
    };

    return (
        <div className="fixed inset-0 z-[100] font-poppins flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        
                        <h2 className="text-2xl font-semibold text-gray-900">How would you like to proceed?</h2>
                        <p className="text-gray-500 mt-2">Sign in to track your order and earn points, or continue as a guest.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Sign In Option */}
                        <button
                            onClick={handleSignIn}
                            className="w-full flex items-center justify-between p-4 border-2 border-transparent bg-black text-white rounded-2xl hover:bg-gray-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                    <User size={20} />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-sm">Sign In / Register</div>
                                    <div className="text-xs text-gray-400">Save address & track orders</div>
                                </div>
                            </div>
                            <X className="rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
                        </button>

                        {/* Guest Option */}
                        <button
                            onClick={() => {
                                onClose();
                                onContinueAsGuest();
                            }}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-100 bg-white text-gray-900 rounded-2xl hover:border-black transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                    <ShoppingBag size={20} className="text-gray-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-sm">Continue as Guest</div>
                                    <div className="text-xs text-gray-500">Quick checkout, no account needed</div>
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GuestCheckoutModal;
