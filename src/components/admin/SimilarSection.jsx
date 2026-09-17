import React, { useRef, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import SimilarCard from "./SimilarCard";
import TitleHeader from "./TitleHeader";
import { useGetProductByCat } from "../api/hooks/useProduct";
import { parseImages } from "../utils/parseImages";

const AUTO_SCROLL_INTERVAL = 3000; // ms

const SimilarSection = ({categoryId, productId}) => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { data:products, isLoading } = useGetProductByCat(categoryId);
 
    const similarProducts = products?.filter(p => p.productId !== productId && p.isActive);


  // Manual scroll (arrows)
  const scrollByAmount = (dir) => {
    if (!scrollRef.current) return;

    const cardWidth =
      scrollRef.current.querySelector("[data-card]")?.offsetWidth || 300;

    scrollRef.current.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  // Auto scroll
  useEffect(() => {
    if (isHovered) return;

    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const maxScroll =
        container.scrollWidth - container.clientWidth;

      // If reached end → loop back
      if (container.scrollLeft >= maxScroll - 5) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByAmount("right");
      }
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isHovered]);
  

  return (
    <>
    {similarProducts?.length > 0 && <div className="max-w-7xl  mx-auto px-2 pb-5 md:pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2 mb-4">
    <h2 className="text-[clamp(1.5rem,4vw,2rem)]  font-montserrat">
        Similar Products
      </h2>
    </div>

        {/* Arrows (hidden on mobile) */}
        {/* <div className="hidden md:flex gap-2">
          <button
            onClick={() => scrollByAmount("left")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => scrollByAmount("right")}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
          >
            <ArrowRight />
          </button>
        </div> */}
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="
          mt-5 pb-2
          flex xl:grid  xl:grid-cols-5 gap-4 overflow-x-auto flex-nowrap
          scrollbar-hide
          snap-x snap-mandatory
        "
      >
        {similarProducts?.slice(0,5).map((product) => {
            const primaryImage = parseImages(product?.images)?.find((img) => img.isPrimary)?.imageUrl ||
    parseImages(product?.images)?.imageUrl ||
    null;
    return (
          <div
            key={product.productId}
            data-card
            className="
              snap-start xl:min-w-60   bg-green-300
            "
          >
            <SimilarCard 
            id = {product.productId}
            productName = {product.productName}
            productImage = {primaryImage}
            productBrand = {product.brandName}
            productPrice = {product.price}
            discountPrice = {product.discountPrice}
            avgRating = {product.avgRating}
            />
          </div>
)})}
      </div>
    </div>}
    </>
  );
};

export default SimilarSection;
