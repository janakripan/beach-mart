import React from "react";

const ImageCell = ({ images, name, isActive }) => {
  return (
    <div
      className={`${
        isActive ? `opacity-100` : `opacity-50`
      } relative h-12 w-16 overflow-visible transition-all duration-300`}
    >
      {images?.length > 0 ? (
        <div className="flex relative">
          {images.map((img, index) => (
            <div
              key={index}
              className="absolute h-12 w-12 rounded-md overflow-hidden
          cursor-pointer bg-gray-100 transition-all duration-300 ease-in-out"
              style={{
                left: `${index * 25}px`,
                zIndex: index,
                transform: `translateZ(0)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.8) translateZ(0)";
                e.currentTarget.style.zIndex = "20";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateZ(0)";
                e.currentTarget.style.zIndex = index.toString();
              }}
            >
              <img
                src={img?.ImageUrl || img?.imageUrl}
                alt={`${name || "Product"} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-12 w-12 rounded-md flex items-center justify-center text-xs text-gray-400 bg-gray-100">
          No image
        </div>
      )}
    </div>
  );
};

export default ImageCell;
