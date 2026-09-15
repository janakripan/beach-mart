import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react';
import { useShop } from '../../../context/ShopContext';

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, cartItems, wishlistItems } = useShop();
  
  const inCart = cartItems.some((item) => item.product.id === product.id);
  const inWishlist = wishlistItems.some((item) => item.id === product.id);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full transition-all duration-300 flex flex-col justify-between cursor-pointer
        ${
          isHovered
            ? "bg-white border border-primary shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)] rounded-[16px]"
            : "bg-white rounded-[16px] border border-border-light"
        }
      `}
    >
      {/* Top action icons (visible on hover or active state) */}
      <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 z-10 ${isHovered || inWishlist ? 'opacity-100' : 'opacity-0'}`}>
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
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="w-8 h-8 rounded-full bg-bg-light hover:bg-primary hover:text-white flex items-center justify-center text-text-muted transition-colors"
        >
          <Eye size={16} strokeWidth={1.5} />
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
      <div className="flex justify-between items-center w-full p-[16px]">
        <div className="flex flex-col justify-center">
          <span
            className={`font-poppins text-[12px] md:text-[13px] leading-[150%] transition-colors duration-300 line-clamp-2 ${isHovered ? "font-normal text-primary" : "font-light text-text-muted"}`}
          >
            {product.name}
          </span>
          <div className="flex items-center gap-1 font-poppins font-semibold text-[14px] md:text-[16px] leading-[150%] text-text-main">
            <span className="text-[12px] md:text-[14px]">₾</span> {product.price}
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!inCart) addToCart(product); 
          }}
          className={`w-[32px] h-[32px] md:w-[38px] md:h-[38px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300
            ${inCart || isHovered ? "bg-primary" : "bg-bg-light"}
          `}
        >
          {inCart ? (
            <Check className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] text-white" strokeWidth={1.5} />
          ) : (
            <ShoppingCart
              className={`w-[16px] h-[16px] md:w-[18px] md:h-[18px] ${isHovered ? "text-white" : "text-text-main"}`}
              strokeWidth={1.25}
            />
          )}
        </button>
      </div>
    </div>
  );
}
