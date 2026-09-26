import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import OfferProductCard from "./OfferProductCard";
import SectionHeader from "./SectionHeader";
import { useAppLoading } from "../../../../context/AppLoadingContext";
import { useAppStore } from "../../../../store/appStore";

export default function OfferSection() {
  const { isLoading: appLoading } = useAppLoading();
  const rawProducts = useAppStore(state => state.products) || [];
  const rawCategories = useAppStore(state => state.categories) || [];

  const targetCategoryIds = useMemo(() => {
    return rawCategories
      .filter(c => c.CategoryName?.toLowerCase().includes('daily offer'))
      .map(c => c.CategoryID);
  }, [rawCategories]);

  const products = rawProducts.filter(p => p.IsActive && targetCategoryIds.includes(p.Categorie)).map(product => {
    let priceVal = product.Price;
    
    if (product.ProductVariants?.length > 0) {
      priceVal = product.ProductVariants[0]?.price?.price ?? priceVal;
    }

    let originalPrice = priceVal;
    if (product.Discount > 0) {
      if (product.DiscMode === 'Percentage' || product.DiscMode === 'percentage') {
        priceVal = priceVal - (priceVal * (product.Discount / 100));
      } else {
        priceVal = priceVal - product.Discount;
      }
    }

    return {
      id: product.ProductID,
      name: product.ProductName,
      image: product.ImageUrl1 || "https://placehold.co/400",
      price: Math.max(0, priceVal).toFixed(2),
      originalPrice: product.Discount > 0 ? originalPrice.toFixed(2) : null,
      categoryId: product.Categorie,
      brandId: null,
    };
  }).slice(0, 15); // Show up to 15 products

  const isLoading = appLoading || rawProducts.length === 0;

  return (
    <section className="w-full flex justify-center bg-white py-6 lg:py-12">
      <div className="w-full max-w-7xl flex flex-col gap-[24px] px-0.5 xs:px-1 sm:px-1 md:px-4 lg:px-16">
        {/* Offer Banner */}
        <div className="relative w-full max-w-6xl min-h-[160px] md:min-h-[358px] rounded-[10px] overflow-hidden bg-[#00380E] flex flex-col lg:flex-row mx-auto">
          {/* Background image container that stays absolute on lg+ to prevent pushing content */}
          <div className="absolute left-0 top-0 w-full lg:w-[50%] h-full hidden lg:block">
            <img
              src="/assets/landing/daily offer/offer image.jpg"
              alt="Daily Offer"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(270deg, #00380E 0%, rgba(0, 56, 14, 0) 100%)",
              }}
            ></div>
          </div>

          {/* Mobile image */}
          <div className="relative w-full h-[120px] md:h-[250px] lg:hidden">
            <img
              src="/assets/landing/daily offer/offer image.jpg"
              alt="Daily Offer"
              className="w-full h-full object-cover rounded-t-[10px]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#00380E] to-transparent"></div>
          </div>

          {/* Flex spacer for image area on lg+ */}
          <div className="hidden lg:block lg:w-[50%] shrink-0"></div>

          {/* Right Side Content */}
          <div className="relative flex flex-col justify-center gap-[8px] md:gap-[16px] w-full lg:flex-1 z-10 text-white p-4 md:p-6 lg:py-[60px] lg:pr-[60px] lg:pl-0">
            <div className="flex flex-col gap-[4px] md:gap-[12px]">
              <span className="font-poppins font-medium text-[12px] md:text-[14px] lg:text-[16px] leading-[100%] tracking-[0.02em] uppercase text-white">
                Daily SALE OFFER
              </span>
              <div className="font-poppins font-semibold text-[24px] sm:text-[40px] md:text-[56px] leading-[120%] text-white flex items-center gap-1 sm:gap-2 md:gap-4">
                <span className="text-accent">10%</span> OFF
              </div>
            </div>

            <p className="font-poppins font-normal text-[12px] md:text-[14px] lg:text-[16px] leading-[150%] text-white max-w-full lg:max-w-[380px]">
              Receive a 10% discount daily on groceries, along with
              complimentary delivery and quick service.
            </p>

            <button className="mt-1 md:mt-2 lg:mt-4 bg-primary hover:bg-secondary text-white font-poppins font-medium text-[12px] md:text-[14px] lg:text-[16px] rounded-full px-4 py-2 md:px-6 md:py-3 flex items-center w-fit gap-2 transition-colors">
              Shop Now <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Item Cards Section */}
        <div className="w-full max-w-6xl bg-[#E4FFEB] rounded-[32px] lg:rounded-[56px] border-b border-border-light py-4 px-0 xs:px-2 md:py-6 md:px-4 lg:pt-[32px] lg:pr-[32px] lg:pb-[32px] lg:pl-[32px] mx-auto">
          <div className="flex flex-col gap-[16px] w-full max-w-5xl mx-auto">
            {/* Top Header Container */}
            <SectionHeader title="Daily Offers 10%" titleColor="var(--color-primary)">
              <div className="bg-primary rounded-[8px] px-[8px] py-[3px] flex items-center justify-center">
                <span className="font-poppins font-bold text-[12px] md:text-[14px] leading-[150%] text-white">
                  24:51:21
                </span>
              </div>
            </SectionHeader>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-[4px] xs:gap-[8px] md:gap-[12px] lg:gap-[16px] gap-y-[12px] xs:gap-y-[24px] mt-4 justify-items-center">
              {isLoading ? (
                Array.from({ length: 15 }).map((_, index) => (
                  <OfferProductCard key={index} product={{}} isLoading={true} />
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <OfferProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-center w-full">
                  <p className="text-text-main font-poppins font-medium text-[14px] md:text-[16px]">There are no daily offers currently</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
