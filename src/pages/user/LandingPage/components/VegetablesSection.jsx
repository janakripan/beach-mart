import React, { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useAppLoading } from '../../../../context/AppLoadingContext';
import ProductCardShimmer from '../../Shop/components/ProductCardShimmer';
import { useAppStore } from '../../../../store/appStore';

export default function VegetablesSection() {
  const { isLoading: appLoading } = useAppLoading();
  const rawProducts = useAppStore(state => state.products) || [];
  const rawCategories = useAppStore(state => state.categories) || [];
  const navigate = useNavigate();

  const targetCategoryIds = useMemo(() => {
    return rawCategories
      .filter(c => c.CategoryName?.toLowerCase().includes('fruit') || c.CategoryName?.toLowerCase().includes('vegetable'))
      .map(c => c.CategoryID);
  }, [rawCategories]);

  const products = rawProducts
    .filter(p => p.IsActive && targetCategoryIds.includes(p.Categorie))
    .map(product => {
      let priceVal = product.Price;
      if (product.ProductVariants?.length > 0) {
        priceVal = product.ProductVariants[0]?.price?.price ?? priceVal;
      }
      return {
        id: product.ProductID,
        name: product.ProductName,
        image: product.ImageUrl1 || "https://placehold.co/400",
        price: priceVal,
        categoryId: product.Categorie,
        brandId: null,
      };
    }).slice(0, 15); // Show at least 15 products to ensure 3 rows on large screens

  const isLoading = appLoading || rawProducts.length === 0;

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
              Vegetables and Fruits
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

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-[4px] xs:gap-[8px] md:gap-[16px]">
          {isLoading 
            ? Array.from({ length: 15 }).map((_, i) => <ProductCardShimmer key={i} />)
            : products.length > 0 ? products.map((product) => (
                <ProductCard key={product.id} product={product} />
              )) : <p>No products found</p>
          }
        </div>

      </div>
    </section>
  );
}
