import React, { useState } from 'react';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import DirhamIcon from '../../../components/CustomIcons/DirhamIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../../context/ShopContext';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, cartItems, wishlistItems, updateQuantity, removeFromCart } = useShop();
  
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsHovered(true);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full transition-all duration-300 flex flex-col justify-between cursor-pointer bg-white rounded-[16px] border
        ${
          isHovered
            ? "border-gray-200 md:border-border-light lg:border-primary lg:shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)]"
            : "border-gray-200 md:border-border-light lg:border-border-light lg:shadow-none"
        }
      `}
    >
      {/* Top action icons (visible on mobile/tablet, and on hover for desktop) */}
      <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 z-10 ${isHovered || inWishlist ? 'opacity-100' : 'opacity-100 lg:opacity-0'}`}>
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!inWishlist) addToWishlist(product); 
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
            ${inWishlist ? 'bg-primary text-white' : 'bg-bg-light hover:bg-primary hover:text-white text-text-muted'}
          `}
        >
          <Heart size={16} strokeWidth={1.5} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden p-[5px]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply rounded-t-[11px]" 
        />
      </div>

      {/* Product Details & Cart */}
      <div className="flex flex-col justify-end w-full py-[8px] xs:py-[12px] px-0.5 xs:px-1.5 md:p-2 lg:p-[16px] gap-0 flex-1">
        {/* Name Container */}
        <div className="w-full">
          <span
            className={`font-poppins text-[12px] md:text-[13px] leading-[150%] transition-colors duration-300 line-clamp-2 ${isHovered ? "font-normal text-primary" : "font-light text-text-muted"}`}
          >
            {product.name}
          </span>
        </div>

        {/* Price & Cart Container */}
        <div className="flex flex-row justify-between items-end w-full gap-1 sm:gap-2 min-h-fit">
          <div className="flex items-center gap-1 font-poppins font-semibold text-[12px] xs:text-[14px] md:text-[16px] leading-[100%] text-text-main shrink-0 pb-1 md:pb-1.5">
            <span className="flex items-center justify-center pt-0.5">
              <DirhamIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-3.5 md:h-3.5" />
            </span> 
            {product.price}
          </div>

        {/* Cart / Quantity Button */}
        <AnimatePresence mode="wait">
          {inCart ? (
            <motion.div 
              key="counter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between bg-primary rounded-full px-1 xs:px-2 py-1 w-[80px] xs:w-[110px] h-[26px] xs:h-[32px] md:w-[86px] md:h-[38px] shrink-0"
            >
              <button
                onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, -1) : removeFromCart(product.id)}
                className="w-[20px] h-[20px] xs:w-[24px] xs:h-[24px] md:w-[28px] md:h-[28px] text-white hover:bg-white/20 rounded-full flex items-center justify-center text-[14px] xs:text-[16px] font-medium transition-colors"
              >
                -
              </button>
              <div className="w-[20px] h-[20px] xs:w-[24px] xs:h-[24px] md:w-[28px] md:h-[28px] bg-white text-primary rounded-[4px] flex items-center justify-center font-poppins text-[11px] xs:text-[12px] md:text-[14px] font-semibold shadow-sm">
                {cartItem.quantity}
              </div>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-[20px] h-[20px] xs:w-[24px] xs:h-[24px] md:w-[28px] md:h-[28px] text-white hover:bg-white/20 rounded-full flex items-center justify-center text-[14px] xs:text-[16px] font-medium transition-colors"
              >
                +
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => { 
                e.stopPropagation(); 
                addToCart(product); 
              }}
              className="w-[28px] xs:w-[32px] md:w-[38px] h-[28px] xs:h-[32px] md:h-[38px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-light hover:bg-primary group"
            >
              <ShoppingCart
                className="w-[14px] h-[14px] xs:w-[16px] xs:h-[16px] md:w-[18px] md:h-[18px] text-text-main group-hover:text-white transition-colors duration-300"
                strokeWidth={1.25}
              />
            </motion.button>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
