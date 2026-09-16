import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import DirhamIcon from '../../../components/CustomIcons/DirhamIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from "../../../context/ShopContext";

export default function OfferProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useShop();
  
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) setIsHovered(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full max-w-[260px] h-full p-[8px] transition-all duration-300 flex flex-col items-center justify-between cursor-pointer shrink-0 bg-white border rounded-[24px] md:rounded-[56px]
        ${
          isHovered
            ? "border-gray-200 md:border-transparent lg:border-primary lg:shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)]"
            : "border-gray-200 md:border-transparent lg:border-transparent lg:shadow-none"
        }
      `}
    >
      {/* Product Image Box */}
      <div className="w-full aspect-square rounded-[16px] md:rounded-[48px] bg-gray-50 flex items-center justify-center overflow-hidden isolate">
        <img
          src={product.image}
          alt={product.name}
          className="w-auto h-[110%] object-cover"
        />
      </div>

      {/* Product Details & Cart */}
      <div className="flex flex-col justify-end w-full  md:px-4 py-3 md:py-4 gap-0 flex-1">
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
         <div className="flex items-center gap-1 font-poppins font-semibold text-[13px] md:text-[22px] leading-[100%] text-text-main shrink-0 pb-1 md:pb-1.5">
            <span className="flex items-center justify-center pt-0.5">
              <DirhamIcon className="w-2.5 h-2.5 md:w-4.5 md:h-4.5" />
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
              className="flex items-center justify-between bg-primary rounded-full px-2 py-1 w-[110px] md:w-[86px] h-[32px] md:h-[40px] shrink-0"
            >
              <button
                onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, -1) : removeFromCart(product.id)}
                className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] text-white hover:bg-white/20 rounded-full flex items-center justify-center text-[16px] font-medium transition-colors"
              >
                -
              </button>
              <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] bg-white text-primary rounded-[4px] flex items-center justify-center font-poppins text-[12px] md:text-[14px] font-semibold shadow-sm">
                {cartItem.quantity}
              </div>
              <button
                onClick={() => updateQuantity(product.id, 1)}
                className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] text-white hover:bg-white/20 rounded-full flex items-center justify-center text-[16px] font-medium transition-colors"
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
              className="w-[32px] md:w-[40px] h-[32px] md:h-[40px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-light hover:bg-primary group"
            >
              <ShoppingCart
                className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-text-main group-hover:text-white transition-colors duration-300"
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
