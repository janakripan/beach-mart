
import { Star } from "lucide-react";
import dirham from "../assets/dirham.svg";
import Tag from "./Tag";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, image, name, price, discountPrice, avgRating, totalReviews }) => {
  const navigate = useNavigate()
  const navigateToProductDetails = (id) => {
    
    navigate(`/product/${id}`);
  }
  const hasDiscount =
    Number(discountPrice) > 0 &&
    Number(discountPrice) < Number(price);

  const displayPrice = hasDiscount ? discountPrice : price;

  const safeRating = Number(avgRating) || 0;
  const roundedRating = Math.round(safeRating * 2) / 2;
  return (
    <div
      onClick={() => navigateToProductDetails(id)}
      className="
        bg-white  cursor-pointer 
        flex flex-col  md:gap-2 items-center
        p-1 md:p-2
        rounded-xl md:rounded-4xl font-roboto shadow-md hover:shadow-lg   
        
      "
    >
      {/* Image */}
      <div
        className="
          w-full aspect-square
          overflow-hidden rounded-xl md:rounded-3xl bg-white relative
        "
      >
        <img
          src={image}
          alt="Chanel No. 5 Eau de Parfum"
          className="w-full h-full object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 flex items-center gap-1">
            <Tag
              color="#000000"
              title={`${Math.round(
                ((price - discountPrice) / price) * 100
              )}% OFF`}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-1  px-1 md:pl-3 py-1">
        {/* Product Title */}
        <h2 className="text-[#0D0D0D] font-medium line-clamp-1 text-[clamp(0.9rem,1.5vw,1rem)]">
          {name}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap items-center text-[#6B7280] gap-x-3 gap-y-1 text-[clamp(0.7rem,2vw,0.875rem)]">
          <span>Fresh • Woody</span>
          <span>EDP</span>
          <span>100ml</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => {
              const isFilled = safeRating > 0 && index + 1 <= roundedRating;

              return (
                <Star
                  key={index}
                  size={16}
                  strokeWidth={1}
                  fill={isFilled ? "#FCCD56" : "transparent"}
                  color="#FCCD56"
                />
              );
            })}
          </div>

          <span className="text-[#6B7280] text-[clamp(0.7rem,2vw,0.875rem)]">
            ({safeRating.toFixed(1)})
          </span>

          <span className="hidden md:flex text-[#0D0D0D] font-semibold text-[clamp(0.7rem,2vw,0.875rem)]">
            {Number(totalReviews) > 0 ? `${totalReviews} Reviews` : "No reviews"}
          </span>
        </div>



        {/* Price + CTA */}
        <div className="flex justify-between items-center">
          {/* Price */}
          <div className="flex items-center gap-2">
            {hasDiscount && (
              <span className="font-montserrat text-gray-400 text-[clamp(0.8rem,2vw,1rem)] line-through">
                {price}
              </span>
            )}
            <div className="flex items-center   ">
              <img
                src={dirham}
                alt="dirham"
                className="inline w-3 h-3 md:w-4 md:h-5  "
              />

              <span className="font-montserrat text-[clamp(0.8rem,2vw,1rem)] font-semibold">
                {displayPrice}
              </span>

            </div>

          </div>


          {/* <button
            className="
              bg-[#0D0D0D] hover:bg-transparent
              cursor-pointer
              font-poppins
              px-4 py-2
              rounded-full
              border border-black
              transition-colors duration-150 ease-in-out
              text-white hover:text-black
              text-[clamp(0.75rem,2.2vw,0.875rem)]
            "
          >
            View and Buy
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
