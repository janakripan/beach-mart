import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import DirhamIcon from '../CustomIcons/DirhamIcon';
import { useShop } from '../../../context/ShopContext';
import { useLenis } from 'lenis/react';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useShop();
  const lenis = useLenis();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = 'unset';
      lenis?.start();
    };
  }, [isCartOpen, lenis]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 z-60 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-dvh w-[90%] max-w-[400px] bg-white z-60 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border-light">
              <h2 className="font-poppins font-semibold text-xl text-text-main">
                Shopping Cart ({cartCount})
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 pb-8 md:pb-4 flex flex-col gap-4">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                  <p className="font-poppins">Your cart is empty.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4 border border-border-light rounded-[12px] p-3">
                    {/* Image */}
                    <div className="w-[80px] h-[80px] bg-bg-light rounded-[8px] flex items-center justify-center p-2 shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="font-poppins font-medium text-text-main text-[15px]">
                          {item.product.name}
                        </span>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="font-poppins font-semibold text-text-main flex items-center">
                        <span className="flex items-center justify-center pt-0.5 pr-[2px]">
                          <DirhamIcon className="w-3.5 h-3.5" />
                        </span>
                        {item.product.price}
                      </div>
                      
                      {/* Quantity */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-border-light rounded-[20px] overflow-hidden bg-bg-light h-[32px]">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="px-3 hover:text-primary transition-colors h-full flex items-center">
                            <Minus size={14} />
                          </button>
                          <span className="font-poppins font-medium text-[14px] w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="px-3 hover:text-primary transition-colors h-full flex items-center">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-border-light bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-poppins text-text-muted">Subtotal:</span>
                  <span className="font-poppins font-bold text-xl text-text-main flex items-center">
                    <span className="flex items-center justify-center pt-1 pr-1">
                      <DirhamIcon className="w-5 h-5" />
                    </span>
                    {cartTotal.toFixed(2)}
                  </span>
                </div>
                <button className="w-full bg-primary hover:bg-secondary text-white font-poppins font-semibold text-[16px] rounded-[30px] h-12 transition-colors flex items-center justify-center">
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
