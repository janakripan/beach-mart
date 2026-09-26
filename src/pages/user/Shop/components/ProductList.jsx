
import React, { useState } from "react";
import ProductCard from "../../LandingPage/components/ProductCard";
import NoProduct from "../../../../assets/NoProducts.gif";
import ProductCardShimmer from './ProductCardShimmer';
import { useAppStore } from '../../../../store/appStore';
import { useAppLoading } from '../../../../context/AppLoadingContext';

const ProductList = ({ filters }) => {
  const { isLoading: appLoading } = useAppLoading();
  const rawProducts = useAppStore(state => state.products) || [];
  
  // Client-side filtering
  const filteredProducts = rawProducts.filter(p => {
    if (!p.IsActive) return false;
    if (filters?.categoryIDs?.length > 0) {
      const catIds = filters.categoryIDs.map(id => Number(id));
      if (!catIds.includes(p.Categorie)) return false;
    }
    if (filters?.search && !p.ProductName?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const isLoading = appLoading || rawProducts.length === 0;
  const isFetching = false;

  // Map backend products to the format expected by ProductCard
  const products = filteredProducts.map(product => {
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
      // Pass the original object just in case
      original: product
    };
  });

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
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
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Simple pagination UI or load indicator if needed */}
          {isFetching && !isLoading && (
             <div className="h-12 flex justify-center items-center">
               <DotWaveLoader />
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
