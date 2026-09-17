const ProductCardShimmer = () => {
  return (
    <div className="p-2 border border-gray-200 flex flex-col gap-1 rounded-2xl font-montserrat h-full">
      {/* Image */}
      <div className="h-40 md:h-60 w-full rounded-2xl shimmer relative shrink-0">
        {/* Discount badge */}
        <div className="absolute top-2 left-2 h-6 w-16 rounded shimmer" />
        {/* Wishlist icon */}
        <div className="absolute top-2 right-2 h-8 w-8 rounded-full shimmer" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 gap-2 mt-1">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded shimmer" />
            ))}
          </div>
          <div className="h-3 w-10 rounded shimmer" />
          <div className="hidden md:block h-3 w-20 rounded shimmer" />
        </div>

        {/* Product name */}
        <div className="h-4 w-3/4 rounded shimmer" />

        {/* Price */}
        <div className="flex gap-2 items-center mt-1">
          <div className="h-4 w-14 rounded shimmer" />
          <div className="h-4 w-20 rounded shimmer" />
        </div>

        {/* CTA */}
        <div className="h-9 md:h-10 w-full rounded-full shimmer" />
      </div>
    </div>
  );
};

export default ProductCardShimmer;
