import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const useGetProducts = ({
  page = 1,
  pageSize = 10,
  productID,
  productName,
  categoryID,
  brandID,
  sortBy,
  sortType,
} = {}) => {
  return useQuery({
    queryKey: [
      "products",
      page,
      pageSize,
      productID,
      productName,
      categoryID,
      brandID,
      sortBy,
      sortType,
    ],
    queryFn: () =>
      productService.getProducts({
        page,
        pageSize,
        productID,
        productName,
        categoryID,
        brandID,
        sortBy,
        sortType,
      }),
    keepPreviousData: true,
  });
};

export const useGetProductById = (productID) =>
  useQuery({
    queryKey: ["product", productID],
    queryFn: () => productService.getProductById(productID),
    enabled: !!productID,
  })

  export const useGetProductByCat = (categoryID) =>
  useQuery({
    queryKey: ["product", categoryID],
    queryFn: () => productService.getProductByCat(categoryID),
    enabled: !!categoryID,
  })

export const useFilteredProducts = (filters) => {
  return useInfiniteQuery({
    queryKey: ["filtered-products", filters],
    queryFn: ({ pageParam = 1 }) =>
      productService.getFilteredProducts({ filters, pageParam }),

    getNextPageParam: (lastPage, allPages) => {
      // Backend must return pageSize items
      if (!lastPage || lastPage.length < filters.pageSize) return undefined;
      return allPages.length + 1;
    },

    enabled: !!filters?.pageSize,
    staleTime: 60 * 1000,
  });
};

export const useGetFilters =()=>{
  return useQuery({
    queryKey:["filters"],
    queryFn: () => productService.getAllFilters()
  })
}


export const useProductSearch = (query) => {
  return useQuery({
    queryKey: ["product-search", query],
    queryFn: () => productService.searchProducts(query),
    enabled: !!query,          // 🔑 no empty search
    staleTime: 1000 * 30,       // cache for 30s
  });
};


export const useGetBestSellers =()=>{
  return useQuery({
    queryKey:["best-seller-products"],
    queryFn: () => productService.getBestSellerProducts()
  })
}

export const useGetTrending =()=>{
  return useQuery({
    queryKey:["trending-products"],
    queryFn: () => productService.getTrendingProducts()
  })
}
