import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { FaBan } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const CurrentVariants = ({
  variants,
  removeVariant,
  handleStockEmpty,
  editVariant,
  variantsListRef,
}) => {
  if (!variants || variants.length === 0) return null;
  console.log(variants)
  return (
    <div className="mb-4" ref={variantsListRef}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Added Variants</h4>
      <div className="flex flex-col gap-y-2">
        {variants.map((variant, index) => (
          <div
            key={index}
            className={`p-2 flex border border-gray-200 rounded-lg
              ${
                variant.stock.onhand === 0 && `opacity-50 bg-gray-100`
              } justify-between items-center`}
          >
            <div className="flex items-center gap-x-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                {variant?.images && variant.images[0]?.imageUrl ? (
                  <img
                    src={variant.images[0].imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium">SKU: {variant.sku}</p>
                <p className="text-xs text-gray-500">
                  Price: AED {variant.price?.price} | Stock:{" "}
                  {variant.stock.onhand}
                </p>
                <div className="flex gap-x-2 mt-1">
                  {variant.colorId && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                      Color: {variant.colorName || variant.colorId}
                    </span>
                  )}
                  {variant.sizeId && (
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                      Size: {variant.sizeLabel || variant.sizeId}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-x-2">
              <button
                type="button"
                onClick={() => editVariant(index)}
                className="text-gray-500 cursor-pointer hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                title="Edit variant"
              >
                <AiOutlineEdit size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleStockEmpty(index)}
                className="text-gray-500 cursor-pointer hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                title="Out of Stock"
              >
                <FaBan size={18} />
              </button>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="text-gray-500 cursor-pointer hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                title="Out of Stock"
              >
                <MdDeleteOutline size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentVariants;
