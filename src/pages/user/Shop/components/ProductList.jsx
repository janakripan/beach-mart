
import React, { useEffect, useRef } from "react";
import ProductCard from "../../LandingPage/components/ProductCard";
import NoProduct from "../../../../assets/NoProducts.gif";
import ProductCardShimmer from './ProductCardShimmer';
import { useGetInfiniteProducts } from '../../../../api/shared/hooks';

const ProductList = ({ filters }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetInfiniteProducts({
    categoryIDs: filters?.categoryIDs?.map(Number) || [],
    productName: filters?.search || "",
    pageSize: 24,
  });

  const rawProducts = data?.pages?.flatMap(page => page.products) || [];
  
  // Backend already filters by category and search
  const filteredProducts = rawProducts.filter(p => p.IsActive);

  // Map backend products to the format expected by ProductCard
  const products = filteredProducts.map(product => {
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
      original: product
    };
  });

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.1, rootMargin: '400px' });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <ProductCardShimmer key={index} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <img src={NoProduct} className="h-28 w-28" />
          <p>No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Invisible loader element at the bottom */}
          <div ref={loaderRef} className="h-4 w-full" />
          
          {isFetchingNextPage && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
               {Array.from({ length: 4 }).map((_, index) => (
                 <ProductCardShimmer key={index} />
               ))}
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
