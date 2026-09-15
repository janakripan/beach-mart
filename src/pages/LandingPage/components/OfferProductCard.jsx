import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
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
      className={`w-full max-w-[260px] h-full p-[8px] transition-all duration-300 flex flex-col items-center justify-between cursor-pointer shrink-0
        ${
          isHovered
            ? "bg-white border-gray-200 md:border-transparent lg:border-primary lg:shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)] rounded-[56px]"
            : "bg-white rounded-[56px] border border-gray-200 md:border-transparent"
        }
      `}
    >
      {/* Product Image Box */}
      <div className="w-full aspect-square rounded-[48px] bg-gray-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover drop-shadow-md"
        />
      </div>

      {/* Product Details & Cart */}
      <div className="flex flex-col justify-between w-full px-3 md:px-4 py-3 md:py-4 gap-1">
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-2 min-h-[40px]">
          <div className="flex items-center gap-1 font-poppins font-semibold text-[13px] md:text-[16px] leading-[150%] text-text-main shrink-0">
            <span className="text-[11px] md:text-[14px]">₾</span> {product.price}
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
              className="flex items-center justify-between bg-primary rounded-full px-2 py-1 w-full lg:w-[86px] h-[32px] md:h-[40px] shrink-0"
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
              className={`w-full lg:w-[40px] h-[32px] md:h-[40px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300
                ${isHovered ? "bg-primary" : "bg-bg-light"}
              `}
            >
              <ShoppingCart
                className={`w-[16px] h-[16px] md:w-[18px] md:h-[18px] ${isHovered ? "text-white" : "text-text-main"}`}
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
