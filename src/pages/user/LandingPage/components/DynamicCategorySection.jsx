import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import ProductCard from './ProductCard';
import ProductCardShimmer from '../../Shop/components/ProductCardShimmer';
import { useGetProducts } from '../../../../api/shared/hooks';

export default function DynamicCategorySection({ category }) {
  const navigate = useNavigate();
  const targetCategoryIds = useMemo(() => {
    return [category.CategoryID || category.categoryId];
  }, [category]);

  const { data, isLoading } = useGetProducts({
    categoryIDs: targetCategoryIds,
    page: 1,
    pageSize: 10
  });

  const rawProducts = data?.products || [];

  const products = rawProducts
    .filter(p => p.IsActive)
    .map(product => {
      let priceVal = product.Price;
      if (product.ProductVariants?.length > 0) {
        priceVal = product.ProductVariants[0]?.price?.price ?? priceVal;
      }
      return {
        id: product.ProductID,
        name: product.ProductName,
        image: product.ImageUrl1 || product.imageUrl1 || "",
        price: priceVal,
        categoryId: product.Categorie,
        brandId: null,
      };
    });

  const desktopProducts = products.slice(0, 10);
  const mobileProducts = products.slice(0, 6);

  const handleViewAll = () => {
    if (targetCategoryIds.length > 0) {
      navigate(`/shop?category=${targetCategoryIds.join(',')}`);
    } else {
      navigate(`/shop`);
    }
  };

  return (
    <section className="w-full flex justify-center bg-white  lg:py-8">
      <div className="w-full max-w-6xl flex flex-col px-0 xs:px-2 pb-3.5 md:px-8 lg:px-[32px]">
        
        {/* Header Container */}
        <div className="flex flex-row justify-between items-center w-full gap-2 md:gap-0 relative px-2 md:px-0 mb-4 lg:mb-6">
          <div className="flex items-center gap-[8px] md:gap-[24px] flex-wrap justify-start">
            <h2 
              className="font-marcellus font-normal text-[22px] sm:text-[24px] md:text-[32px] leading-[120%] m-0 whitespace-nowrap text-text-main uppercase"
            >
              {category.CategoryName || category.categoryName}
            </h2>
          </div>
          
          {/* Dashed line connecting header to View All */}
          <div 
            className="hidden md:block flex-1 opacity-50 mx-[12px] lg:mx-[24px]"
            style={{ 
              maxWidth: '247.5px', 
              height: '0px', 
              borderTop: '1px dashed var(--color-primary)', 
              borderStyle: 'dashed' 
            }} 
          ></div>

          <button 
            onClick={handleViewAll}
            className="flex items-center gap-1 md:gap-2 text-secondary hover:text-primary font-poppins font-medium text-[12px] sm:text-[14px] md:text-[16px] leading-[150%] transition-colors whitespace-nowrap shrink-0"
          >
            View All <ArrowRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Products Grid (Mobile Only) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-[4px] xs:gap-[8px] md:hidden">
          {isLoading 
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardShimmer key={i} />)
            : mobileProducts.length > 0 ? mobileProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              )) : <p className="col-span-2 text-center text-gray-500 py-4">No products found</p>
          }
        </div>

        {/* Products Carousel (Tablet/Desktop Only) */}
        <div className="hidden md:block w-full">
          {isLoading ? (
            <div className="grid grid-cols-4 xl:grid-cols-5 gap-[16px]">
              {Array.from({ length: 5 }).map((_, i) => <ProductCardShimmer key={i} />)}
            </div>
          ) : desktopProducts.length > 0 ? (
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={4}
              breakpoints={{
                1280: { slidesPerView: 5 }, // xl screens
              }}
              loop={desktopProducts.length > 5} // Only loop if enough products
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              className="w-full !pb-4"
            >
              {desktopProducts.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center text-gray-500 py-4">No products found</p>
          )}
        </div>

      </div>
    </section>
  );
}
