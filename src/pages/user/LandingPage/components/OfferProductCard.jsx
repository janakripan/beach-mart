import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import DirhamIcon from "../../../../components/user/CustomIcons/DirhamIcon";
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from "../../../../context/ShopContext";
import { useAppLoading } from "../../../../context/AppLoadingContext";

export default function OfferProductCard({ product, isLoading: propIsLoading }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useShop();
  const { isLoading: appLoading } = useAppLoading();
  const isLoading = appLoading || propIsLoading;
  
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsHovered(true);
  };

  if (isLoading) {
    return (
      <div className={`w-full max-w-[260px] h-full p-[8px] flex flex-col items-center justify-between shrink-0 bg-white border border-gray-200 md:border-transparent lg:border-transparent rounded-[24px] md:rounded-[24px] lg:rounded-[56px]`}>
        <div className="w-full aspect-square rounded-[16px] md:rounded-[20px] lg:rounded-[48px] overflow-hidden shrink-0 shimmer" />
        <div className="flex flex-col justify-end w-full px-0.5 xs:px-0 md:px-2 lg:px-4 py-1.5 xs:py-3 md:py-2 lg:py-4 gap-0 flex-1 mt-2">
          <div className="w-full">
            <div className="h-4 w-3/4 rounded shimmer mb-2" />
          </div>
          <div className="flex flex-row justify-between items-end w-full gap-1 sm:gap-2 min-h-fit mt-1">
            <div className="h-4 w-12 rounded shimmer mb-1 md:mb-1.5" />
            <div className="w-[28px] xs:w-[32px] md:w-[40px] h-[28px] xs:h-[32px] md:h-[40px] shrink-0 rounded-full shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full max-w-[260px] h-full p-[8px] transition-all duration-300 flex flex-col items-center justify-between cursor-pointer shrink-0 bg-white border rounded-[24px] md:rounded-[24px] lg:rounded-[56px]
        ${
          isHovered
            ? "border-gray-200 md:border-transparent lg:border-primary lg:shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)]"
            : "border-gray-200 md:border-transparent lg:border-transparent lg:shadow-none"
        }
      `}
    >
      {/* Product Image Box */}
      <div className="w-full aspect-square rounded-[16px] md:rounded-[20px] lg:rounded-[48px] bg-gray-50 flex items-center justify-center overflow-hidden isolate">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details & Cart */}
      <div className="flex flex-col justify-end w-full px-0.5 xs:px-0 md:px-2 lg:px-4 py-1.5 xs:py-3 md:py-2 lg:py-4 gap-0 flex-1">
        {/* Name Container */}
        <div className="w-full">
          <span
            className={`font-poppins text-[11px] md:text-[13px] leading-[150%] transition-colors duration-300 truncate block ${isHovered ? "font-normal text-primary" : "font-light text-text-muted"}`}
            title={product.name}
          >
            {product.name}
          </span>
        </div>

        {/* Price & Cart Container */}
        <div className="flex flex-row justify-between items-end w-full gap-1 sm:gap-2 min-h-fit">
         <div className="flex flex-col gap-0">
           {product.originalPrice && (
             <div className="text-[10px] md:text-[12px] text-gray-400 line-through leading-[100%] ml-0.5">
               AED {product.originalPrice}
             </div>
           )}
           <div className="flex items-center gap-1 font-poppins font-semibold text-[11px] xs:text-[13px] md:text-[16px] leading-[100%] text-text-main shrink-0 pb-1 md:pb-1.5 mt-0.5">
              <span className="flex items-center justify-center pt-0.5">
                <DirhamIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 md:w-3.5 md:h-3.5" />
              </span> 
              {product.price}
            </div>
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
              className="flex items-center justify-between bg-primary rounded-full px-1 xs:px-2 py-1 w-[80px] xs:w-[110px] h-[26px] xs:h-[32px] md:w-[86px] md:h-[40px] shrink-0"
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
              className="w-[28px] xs:w-[32px] md:w-[40px] h-[28px] xs:h-[32px] md:h-[40px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-light hover:bg-primary group"
            >
              <ShoppingCart
                className="w-[14px] h-[14px] xs:w-[16px] xs:h-[16px] md:w-4 md:h-4 text-text-main group-hover:text-white transition-colors duration-300"
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
