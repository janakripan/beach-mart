import apiClient from "../../apiClient";

export const productService = {
  getProducts: async ({
    page, pageSize, productID, productName, categoryID, rating, brandID,sortBy, sortType
  }) => {
    if (!page || !pageSize) {
      throw new Error("page and pageSize are required");
    }

    const headers = {
      page,
      pageSize,
      ...(productID && { productID }),
      ...(productName && { productName }),
      ...(categoryID && { categoryID }),
      ...(brandID && { brandID }),
      ...(rating && {rating}),
      ...(sortBy && { sortBy }),
      ...(sortType && { sortType }),
    };

    const response = await apiClient.get("/getProductMaster/", {
      headers,
    });

    return response.data.data;
  },

   getProductById: async (productID) => {
    const response = await apiClient.get("/getProductMaster/", {
      headers: {
        page: 1,
        pageSize: 1,
        productID,
      },
    });
    return response.data.data?.[0];
  },
     getProductByCat: async (categoryID) => {
    const response = await apiClient.get("/getProductMaster/", {
      headers: {
        page: 1,
        pageSize: 10,
        categoryID,
      },
    });
    return response.data.data;
  },

  getFilteredProducts: async ({filters, pageParam = 1}) => {
  const payload = {
    brandIDs: (filters.brandIDs ?? []).join(","),
    categoryIDs: (filters.categoryIDs ?? []).join(","),
    minPrice: filters.minPrice ?? null,
    maxPrice: filters.maxPrice ?? null,
    pageNumber: pageParam,
    pageSize: filters.pageSize,
    ratingFilter: filters.ratingFilter ?? null,
    sortBy: filters.sortBy ?? "",
    sortType: filters.sortType ?? "",
  };

  const res = await apiClient.post("/getProductFilter", payload);
  return res.data.data;
},
  
  getAllFilters: async () => {
    const response = await apiClient.get("/getAllMaster/");
    return response.data.data;
  },

  searchProducts : async (query) => {
  const { data } = await apiClient.get("/search", {
    params: { q: query },
  });
  return data.data ?? []; // 👈 normalize here
},

  getBestSellerProducts : async () => {
    const response = await apiClient.get("/getBestsellerProducts");
    return response.data.data;
  },

  getTrendingProducts : async () => {
    const response = await apiClient.get("/getTrendingProducts");
    return response.data.data;
  },

  }
