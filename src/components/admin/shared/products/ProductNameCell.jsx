import React from "react";
import { BiBadge } from "react-icons/bi";
import { MdCategory } from "react-icons/md";

const ProductNameCell = ({ product }) => {
  const truncatedName =
    product.productName.length > 60
      ? product.productName.substring(0, 60) + "..."
      : product.productName;
  return (
    <div
      className={` transition-all duration-300 ${
        product.isActive ? `opacity-100` : ` opacity-50`
      } flex flex-col`}
    >
      {/* Product Name */}
      <div className="text-sm font-medium truncate hover:text-blue-600 transition-colors cursor-pointer">
        {truncatedName}
      </div>
      <div className="flex items-center gap-x-4">
        {/* Brand with Icon */}
        {product.brandName && (
          <div className="flex gap-x-1 items-center mt-1 text-xs text-gray-500">
            <BiBadge />
            {product.brandName}
          </div>
        )}
        {/* Category  */}
        {product.categoryName && (
          <div className="flex gap-x-1 items-center mt-1 text-xs text-gray-500">
            <MdCategory />
            {product.categoryName}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductNameCell;
