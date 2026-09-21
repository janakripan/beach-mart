const ProductCardShimmer = () => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-white rounded-[16px] border border-gray-200">
      
      {/* Wishlist icon placeholder */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <div className="w-8 h-8 rounded-full shimmer" />
      </div>

      {/* Product Image placeholder */}
      <div className="w-full aspect-square flex items-center justify-center overflow-hidden p-[5px]">
        <div className="w-full h-full rounded-t-[11px] shimmer" />
      </div>

      {/* Product Details & Cart placeholder */}
      <div className="flex flex-col justify-end w-full py-[8px] xs:py-[12px] px-0.5 xs:px-1.5 md:p-2 lg:p-[16px] gap-0 flex-1">
        {/* Name Container */}
        <div className="w-full">
          <div className="h-4 md:h-5 w-3/4 rounded shimmer" />
        </div>

        {/* Price & Cart Container */}
        <div className="flex flex-row justify-between items-end w-full gap-1 sm:gap-2 min-h-fit mt-2">
          {/* Price */}
          <div className="h-4 md:h-5 w-16 rounded shimmer mb-1 md:mb-1.5" />

          {/* Cart Button */}
          <div className="w-[28px] xs:w-[32px] md:w-[38px] h-[28px] xs:h-[32px] md:h-[38px] shrink-0 rounded-full shimmer" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardShimmer;
