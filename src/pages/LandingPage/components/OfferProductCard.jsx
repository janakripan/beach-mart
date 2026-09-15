import React, { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useShop } from "../../../context/ShopContext";

export default function OfferProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, cartItems } = useShop();
  
  const inCart = cartItems.some((item) => item.product.id === product.id);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full max-w-[217.6px] h-full p-[8px] transition-all duration-300 flex flex-col items-center justify-between cursor-pointer shrink-0
        ${
          isHovered
            ? "bg-white border border-primary shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)] rounded-[56px]"
            : "bg-white rounded-[56px] border border-transparent"
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
      <div className="flex justify-between items-center w-full px-4 py-4">
        <div className="flex flex-col justify-center">
          <span
            className={`font-poppins text-[14px] leading-[150%] transition-colors duration-300 ${isHovered ? "font-normal text-primary" : "font-light text-text-muted"}`}
          >
            {product.name}
          </span>
          <div className="flex items-center gap-1 font-poppins font-medium text-[16px] leading-[150%] text-text-main">
            <span className="text-sm">₾</span> {product.price}
          </div>
        </div>

        {/* Cart Button */}
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            if (!inCart) addToCart(product); 
          }}
          className={`w-[42px] h-[42px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300
            ${inCart || isHovered ? "bg-primary" : "bg-bg-light"}
          `}
        >
          {inCart ? (
            <Check size={18} className="text-white" strokeWidth={1.5} />
          ) : (
            <ShoppingCart
              size={18}
              className={isHovered ? "text-white" : "text-text-main"}
              strokeWidth={1.25}
            />
          )}
        </button>
      </div>
    </div>
  );
}
