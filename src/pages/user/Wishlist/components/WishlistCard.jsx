import React, { useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import DirhamIcon from "../../../../components/user/CustomIcons/DirhamIcon";
import { useShop } from "../../../../context/ShopContext";
import { useMessage } from "../../../../components/admin/MessageBox/useMessage";

const WishlistCard = ({ item, onRemove }) => {
  const navigate = useNavigate();
  const { removeFromWishlist, addToCart } = useShop();
  const [isHovered, setIsHovered] = useState(false);
  const message = useMessage();

  const handleRemove = (e, suppressMessage = false) => {
    e.stopPropagation();
    
    // Remove from localStorage (Shop page origin)
    const raw = localStorage.getItem("GUEST_WISHLIST");
    if (raw) {
      const list = JSON.parse(raw);
      const updated = list.filter((i) => i.productID !== item.productID);
      localStorage.setItem("GUEST_WISHLIST", JSON.stringify(updated));
    }

    // Remove from Context (Home page origin)
    removeFromWishlist(item.productID);

    // Call the parent callback to instantly update the local state
    if (onRemove) {
        onRemove(item.productID);
    }
    
    if (!suppressMessage) {
      message.info("Removed from wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: item.productID,
      name: item.name,
      price: item.price,
      image: item.image,
      discountPrice: item.discountPrice
    });
    
    // Remove from wishlist immediately after adding to cart, suppressing the "removed" message
    handleRemove(e, true);
  };

  const imageSrc = item.image;
  const productName = item.name;
  const originalPrice = Number(item.price) || 0;
  const discountedPrice = Number(item.discountPrice) || 0;
  const hasDiscount = discountedPrice > 0 && discountedPrice < originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${item.productID}`)}
      className={`relative w-full transition-all duration-300 flex items-center gap-4 cursor-pointer bg-white rounded-[16px] border p-4
        ${
          isHovered
            ? "border-gray-200 md:border-border-light lg:border-primary lg:shadow-[0px_0px_12px_0px_rgba(32,181,38,0.32)]"
            : "border-gray-200 md:border-border-light lg:border-border-light lg:shadow-none"
        }
      `}
    >
      {/* Image */}
      <div className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center">
        <img
          src={imageSrc}
          alt={productName}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 justify-center gap-2">
        <h3 className="text-[#3F3F3F] font-poppins text-sm md:text-base font-medium line-clamp-2 md:pr-12">
          {productName}
        </h3>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 font-poppins mt-1">
          {hasDiscount ? (
            <>
              {/* Bold Discounted Price */}
              <div className="flex items-center text-[#0D0D0D] font-bold text-lg md:text-xl">
                <DirhamIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                {discountedPrice}
              </div>
              
              {/* Original Price (Strikethrough) */}
              <div className="flex items-center text-[#999999] line-through text-xs md:text-sm">
                <DirhamIcon className="w-2 h-2 md:w-3 md:h-3 mr-0.5" />
                {originalPrice}
              </div>
              
              {/* Discount Percentage */}
              <div className="text-[#34C759] font-medium text-xs md:text-sm">
                {discountPercent}% off
              </div>
            </>
          ) : (
            <div className="flex items-center text-[#0D0D0D] font-bold text-lg md:text-xl">
              <DirhamIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              {originalPrice}
            </div>
          )}
        </div>
        
      </div>

      {/* Right side actions (All screen sizes) */}
      <div className="flex flex-col items-end justify-between self-stretch shrink-0 pl-2 md:pl-4 border-l border-gray-100 min-h-full py-1">
        <button
          onClick={handleRemove}
          className="text-[#B3B3B3] hover:text-red-500 transition-colors p-1"
          aria-label="Remove from wishlist"
        >
          <Trash2 size={18} className="md:w-5 md:h-5" strokeWidth={1.5} />
        </button>
        
        {/* Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-[28px] xs:w-[32px] md:w-[38px] h-[28px] xs:h-[32px] md:h-[38px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300 bg-bg-light hover:bg-primary group"
          title="Move to Cart"
        >
          <ShoppingCart
            className="w-[14px] h-[14px] xs:w-[16px] xs:h-[16px] md:w-4 md:h-4 text-text-main group-hover:text-white transition-colors duration-300"
            strokeWidth={1.25}
          />
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
