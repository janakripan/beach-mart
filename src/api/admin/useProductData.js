/**
 * Custom hook to handle product data, filtering, and operations
 *
 * @param {object} options - Configuration options
 * @param {number} options.initialPage - Initial page number
 * @param {number} options.pageSize - Number of items per page
 * @returns {Object} Product data and operations
 */

import { useEffect, useMemo, useState } from "react";
import {
  useActiveProduct,
  useAddProducts,
  useEditProduct,
  useGetAllCategory,
  useGetBrand,
  useGetColor,
  useGetProducts,
  useGetSizes,
} from "../../api/admin/hooks";

export function useProductData({ initialPage = 1, pageSize = 10 } = {}) {
  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  //filter state for brand and category
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Product data state
  const [processedProducts, setProcessedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  // API queries
  const {
    data: productsData,
    refetch,
    isLoading: productsLoading,
    isError,
  } = useGetProducts({
    page: currentPage,
    pageSize,
    productName: searchQuery || undefined,
    categoryID: categoryFilter || undefined,
    brandID: brandFilter || undefined,
  });

  // Supporting data queries
  const { data: sizes, isLoading: sizesLoading } = useGetSizes();
  const { data: categories, isLoading: categoriesLoading } = useGetAllCategory({
    select: (data) => data.filter((item) => item.IsActive),
  });
  const { data: colors, isLoading: colorsLoading } = useGetColor({
    select: (data) => data.filter((item) => item.IsActive),
  });
  const { data: brands, isLoading: brandsLoading } = useGetBrand({
    select: (data) => data.filter((item) => item.IsActive),
  });

  // Mutations
  const addProduct = useAddProducts();
  const editProduct = useEditProduct();
  const activeProduct = useActiveProduct();

  // Derived state
  const isLoading = useMemo(
    () =>
      productsLoading ||
      sizesLoading ||
      categoriesLoading ||
      colorsLoading ||
      brandsLoading,
    [
      productsLoading,
      sizesLoading,
      categoriesLoading,
      colorsLoading,
      brandsLoading,
    ]
  );

  const isMutating = useMemo(
    () => addProduct.isPending || editProduct.isPending,
    [addProduct.isPending, editProduct.isPending]
  );

  // Process products data
  useEffect(() => {
    if (!productsData) return;

    // Update total pages
    setTotalPages(productsData.totalPages || 1);

    // Transform product data to include variant information
    const processed = productsData.products.map((product) => {
      const hasVariants = product.variants.length > 0;
      if (hasVariants) {
        const firstVariant = product.variants[0];

        return {
          ...product,
          price: firstVariant.price?.price,
          stockQty: firstVariant.stock.onhand,
          images: firstVariant.images,
          discountPrice: firstVariant.price?.discountPrice,
        };
      }
      return product;
    });

    setProcessedProducts(processed);
  }, [productsData]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset to first page when search query changes
      if (currentPage !== 1 && searchQuery.trim() !== "") {
        setCurrentPage(1);
      } else {
        refetch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, refetch, categoryFilter, brandFilter]);

  /**
   * Create new product
   * @param {object} productData - Product data to create
   * @return {Promise} Promise that resolves when operation completes
   */
  const createProduct = async (productData) => {
    const newProduct = { ...productData };

    // Remove single product fields if variants exist
    if (newProduct.variants.length !== 0) {
      delete newProduct.enableVariant;
      delete newProduct.price;
      delete newProduct.discountPrice;
      delete newProduct.stockQty;
    }

    await addProduct.mutateAsync(newProduct);
    await refetch();

    return { success: true };
  };

  /**
   * Update an existing product
   * @param {Object} productData - Updated product data
   * @returns {Promise} Promise that resolves when operation completes
   */
  const updateProduct = async (productData) => {
    await editProduct.mutateAsync({
      updatedProduct: productData,
      productId: currentProduct.productId,
    });
    await refetch();

    return { success: true };
  };

  /**
   * Set the current product being edited
   * @param {Object|null} product - Product object or null to clear
   */
  const setProductToEdit = (product) => {
    setCurrentProduct(product);
  };

  /**
   * Function to handle pagination page change
   * @param {number} newPage - New page number
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  /**
   * Function to handle category filter change
   * @param {string} categoryId - Category ID to filter by
   */
  const handleCategoryFilter = (categoryId) => {
    setCategoryFilter(categoryId);
  };

  /**
   * Function to handle brand filter change
   * @param {string} brandId - Brand ID to filter by
   */
  const handleBrandFilter = (brandId) => {
    setBrandFilter(brandId);
  };

  /**
   * Function to clear all filters
   */
  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setBrandFilter("");
  };

  /**
   * Fucntion to handle active product
   * @param {number} productId - id of the product
   */
  const handleToggleProducts = async (productId,status) => {
    try {
      const filterd = processedProducts.map((item) =>
        item.productId === productId
          ? { ...item, isActive: !item.isActive }
          : item
      );
      setProcessedProducts(filterd);
      await activeProduct.mutateAsync({productId,status});
    } catch (error) {
      const filterd = processedProducts.map((item) =>
        item.productId === productId
          ? { ...item, isActive: !item.isActive }
          : item
      );
      setProcessedProducts(filterd);
    }
  };
  // Return all the data and functions needed by components
  return {
    // Data
    products: processedProducts,
    productsData,
    currentProduct,
    supportingData: {
      sizes,
      categories,
      colors,
      brands,
    },

    // Pagination
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      handlePageChange,
    },
    // Search and filters
    filters: {
      search: {
        query: searchQuery,
        setQuery: setSearchQuery,
      },
      category: {
        value: categoryFilter,
        setValue: handleCategoryFilter,
      },
      brand: {
        value: brandFilter,
        setValue: handleBrandFilter,
      },
      clearAll: clearFilters,
    },

    // Status
    status: {
      isLoading,
      isError,
      isMutating,
    },

    // Operations
    operations: {
      createProduct,
      updateProduct,
      setProductToEdit,
      handleToggleProducts,
      refetch,
    },
  };
}

export default useProductData;
