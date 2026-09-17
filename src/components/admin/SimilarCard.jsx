import React from "react";
import { Star } from "lucide-react";
import dirham from "../assets/dirham.svg";
import Tag from "./Tag";
import OfferTag from "./OfferTag";
import { useNavigate } from "react-router-dom";

const SimilarCard = ({id, productName, productImage, productBrand, productPrice, discountPrice, avgRating  }) => {
const price = Number(productPrice);
const discount = Number(discountPrice);

const navigate = useNavigate()
  const navigateToProductDetails = (id) => {

    navigate(`/product/${id}`);
  }

const hasDiscount =
  Number.isFinite(discount) &&
  discount > 0 &&
  Number.isFinite(price) &&
  discount < price;
  return (
    <div
    onClick={() => navigateToProductDetails(id)}
      className="
        bg-white  cursor-pointer  font-actor
        flex flex-col  md:gap-2 items-center
        p-1 w-full overflow-hidden 
        shadow-xl  border border-[#B3B3B3] 
      "
    >
      {/* Image */}
      <div
        className="
         h-44 w-44  md:w-70  md:h-70 xl:w-full 
          overflow-hidden  bg-white relative
        "
      >
        <img
          src={productImage}
          alt="Chanel No. 5 Eau de Parfum"
          className="w-full h-full object-cover "
        />
        {/* <div className="absolute top-3 left-3 flex items-center gap-1">
          <OfferTag title={"20% off"}/>
          
        </div> */}
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-0.5  px-1 md:pl-3 py-1">

        <div className="flex justify-between font-actor items-center">
            <h2 className="text-sm text-[#D6AD67] ">{productBrand}</h2>
            {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
              <Star
                size={16}
                strokeWidth={1}
                fill="#FCCD56"
                color="#FCCD56"
              />
          </div>
          <span className="text-[#6B7280] text-[clamp(0.7rem,2vw,0.875rem)]">
            {avgRating}
          </span>

          {/* <span className="text-[#0D0D0D] font-semibold text-[clamp(0.7rem,2vw,0.875rem)]">
            24 Reviews
          </span> */}
        </div>

        </div>
        {/* Product Title */}
        <h2 className="text-[#0D0D0D]  font-medium line-clamp-1 text-[clamp(0.9rem,1.5vw,1rem)]">
          {productName}
        </h2>


        

        {/* Price + CTA */}
        <div className="flex justify-between items-center">
  <div className="flex items-center gap-2">
    <img
      src={dirham}
      alt="dirham"
      className="inline w-3 h-4 md:w-4 md:h-4"
    />

    {/* Final price */}
    <span className="text-[clamp(0.8rem,2.5vw,1.125rem)] font-medium">
      {(hasDiscount ? discount : price).toFixed(2)}
    </span>

    {/* Original price (only if discounted) */}
    {hasDiscount && (
      <span className="text-sm text-gray-400 line-through">
        {price.toFixed(2)}
      </span>
    )}
  </div>
</div>

      </div>
    </div>
  )
}

export default SimilarCard
