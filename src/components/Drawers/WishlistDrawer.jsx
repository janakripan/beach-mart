import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useLenis } from 'lenis/react';

export default function WishlistDrawer() {
  const { isWishlistOpen, setIsWishlistOpen, wishlistItems, removeFromWishlist, moveToCart } = useShop();
  const lenis = useLenis();

  useEffect(() => {
    if (isWishlistOpen) {
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
  }, [isWishlistOpen, lenis]);

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWishlistOpen(false)}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[90%] max-w-[400px] bg-white z-[60] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-border-light">
              <h2 className="font-poppins font-semibold text-xl text-text-main">
                Wishlist ({wishlistItems.length})
              </h2>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-text-main hover:bg-primary hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {wishlistItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                  <p className="font-poppins">Your wishlist is empty.</p>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div key={product.id} className="flex gap-4 border border-border-light rounded-[12px] p-3">
                    {/* Image */}
                    <div className="w-[80px] h-[80px] bg-bg-light rounded-[8px] flex items-center justify-center p-2 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <span className="font-poppins font-medium text-text-main text-[15px]">
                          {product.name}
                        </span>
                        <button onClick={() => removeFromWishlist(product.id)} className="text-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="font-poppins font-semibold text-text-main mb-2">
                        ₾{product.price}
                      </div>
                      
                      {/* Actions */}
                      <button 
                        onClick={() => moveToCart(product)}
                        className="flex items-center justify-center gap-2 w-full bg-bg-light hover:bg-primary text-text-main hover:text-white transition-colors h-[36px] rounded-[18px] font-poppins text-[13px] font-medium"
                      >
                        <ShoppingCart size={14} /> Move to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
