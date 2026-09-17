const ProductCardShimmer = () => {
  return (
    <div
      className="
        bg-white
        flex flex-col md:gap-2 items-center
        p-1 md:p-2
        rounded-xl md:rounded-4xl
        shadow-xl
      "
    >
      {/* Image shimmer */}
      <div
        className="
          h-44 w-44 md:w-70 md:h-70 xl:w-full
          rounded-xl md:rounded-3xl
          shimmer
        "
      />

      {/* Content */}
      <div className="w-full flex flex-col gap-2 px-1 md:pl-3 py-1">
        {/* Title */}
        <div className="h-4 w-3/4 rounded shimmer" />

        {/* Meta */}
        <div className="flex gap-2">
          <div className="h-3 w-12 rounded shimmer" />
          <div className="h-3 w-10 rounded shimmer" />
          <div className="h-3 w-10 rounded shimmer" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-4 rounded shimmer" />
            ))}
          </div>
          <div className="h-3 w-10 rounded shimmer" />
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 rounded shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardShimmer;
