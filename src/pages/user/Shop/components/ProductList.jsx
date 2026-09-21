import React, { useRef, useEffect } from "react";
// import ProductCard from "./ProductCard";
// import { useFilteredProducts } from "../../../../api/user/hooks/useProduct";
// import { parseImages } from "../../../../utils/parseImages";
// import { useDebounce } from "../../../../utils/useDebounce";
// import NoProduct from "../../../../assets/NoProducts.gif";
// import DotWaveLoader from "../../../components/DotWaveLoader";
// import ProductCardShimmer from "./ProductCardShimmer";

import { offerProducts, vegetableProducts } from "../../../../constants/data";
import ProductCard from "../../LandingPage/components/ProductCard";
import NoProduct from "../../../../assets/NoProducts.gif";

/* --- COMMENTED OUT DILKA CENTRE DYNAMIC FETCHING LOGIC ---
const ProductList = ({ filters }) => {
  const debouncedFilters = useDebounce(filters, 400);
  const loadMoreRef = useRef(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFilteredProducts(debouncedFilters);

  const products =
    data?.pages.flat().filter((p) => p.isActive) ?? [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const getPrimaryImage = (product) => {
    if (product.variants?.length > 0) {
      const imgs = product.variants[0].images || [];
      return (
        imgs.find((i) => i.isPrimary)?.imageUrl ||
        imgs[0]?.imageUrl ||
        null
      );
    }

    const images = parseImages(product.images);
    return (
      images.find((i) => i.isPrimary)?.imageUrl ||
      images[0]?.imageUrl ||
      null
    );
  };

  const getProductPrice = (product) => {
    if (product.variants?.length > 0) {
      const variant = product.variants[0];
      return {
        price: variant?.price?.price ?? null,
        discountPrice: variant?.price?.discountPrice ?? null,
        variantId: variant?.variantId ?? null,
      };
    }

    return {
      price: product.price ?? null,
      discountPrice: product.discountPrice ?? null,
      variantId: -1,
    };
  };


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
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {products.map((product) => {
            const { price, discountPrice, variantId } = getProductPrice(product);
            return (
              <ProductCard
                key={product.productId}
                productID={product.productId}
                img={getPrimaryImage(product)}
                name={product.productName}
                price={price}
                discountPrice={discountPrice}
                variantID={variantId}
                avgRating={product.avgRating}
                totalReviews={product.totalReviews}
              />
            )
          })}
        </div>
      )}

      <div ref={loadMoreRef} className="h-12 flex justify-center items-center">
        {isFetchingNextPage && <div><DotWaveLoader /></div>}
        {products.length > 0 && !hasNextPage && (
          <p className="text-sm text-gray-400"></p>
        )}
      </div>
    </div>
  );
};
*/

// --- NEW STATIC FRONTEND MAPPING LOGIC ---
import { useAppLoading } from '../../../../context/AppLoadingContext';
import ProductCardShimmer from './ProductCardShimmer';

const ProductList = ({ filters }) => {
  const { isLoading } = useAppLoading();

  const allStaticProducts = [
    ...offerProducts.map(p => ({ ...p, categoryId: 'Fresh Fruit', rating: 5, brandId: 'b-1' })),
    ...vegetableProducts.map(p => ({ ...p, categoryId: 'Fresh Vegetables', rating: 4, brandId: 'b-2' }))
  ];

  // Simple frontend filtering on static data
  const filteredProducts = allStaticProducts.filter((product) => {
    let matches = true;
    
    // Category filter
    if (filters?.categoryIDs?.length > 0) {
      matches = filters.categoryIDs.includes(product.categoryId);
    }

    // Rating filter
    if (matches && filters?.ratingFilter) {
      matches = product.rating >= filters.ratingFilter;
    }

    // Brand filter
    if (matches && filters?.brandIDs?.length > 0) {
      matches = filters.brandIDs.includes(product.brandId);
    }

    // Example: filter by search query if it exists
    if (matches && filters?.search) {
      matches = product.name.toLowerCase().includes(filters.search.toLowerCase());
    }
    
    // Price filters
    if (matches && filters?.minPrice) {
      matches = parseFloat(product.price) >= parseFloat(filters.minPrice);
    }
    if (matches && filters?.maxPrice) {
      matches = parseFloat(product.price) <= parseFloat(filters.maxPrice);
    }

    return matches;
  });

  const sortedAndFilteredProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === "price") {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return filters.sortType === "asc" ? priceA - priceB : priceB - priceA;
    } else if (filters.sortBy === "product") {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return filters.sortType === "asc" ? -1 : 1;
      if (nameA > nameB) return filters.sortType === "asc" ? 1 : -1;
      return 0;
    }
    return 0;
  });

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardShimmer key={index} />
          ))}
        </div>
      ) : sortedAndFilteredProducts.length === 0 ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <img src={NoProduct} className="h-28 w-28" />
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4">
          {sortedAndFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
