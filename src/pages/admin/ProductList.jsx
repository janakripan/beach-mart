import { Edit2, PlusCircle } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
// Constants
import { INITIAL_PRODUCT_DETAILS } from "../../components/admin/shared/constant";
// Components
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import ProductModal from '../../components/admin/shared/products/ProductModal' 
import DeleteModal from "../../components/admin/shared/shared/DeleteModal";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
// Hooks
import ProductFilter from "../../components/admin/shared/products/ProductFilter";
import ProductNameCell from "../../components/admin/shared/products/ProductNameCell";
import FloatingDeleteButton from "../../components/admin/shared/shared/FloatingDeleteButton";
import useProductData from '../../api/admin/useProductData'
import ActiveFilter from "../../components/admin/shared/products/ActiveFilter";
import ImageCell from "../../components/admin/shared/shared/ImageCell";

const ProductList = () => {
  // Product selection and modals state
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(INITIAL_PRODUCT_DETAILS);

  // Use our custom hook for product data management
  const {
    products: processedProducts,
    productsData,
    supportingData: { categories, brands, colors, sizes },
    pagination: { currentPage, totalPages, pageSize, handlePageChange },
    status: { isLoading, isError, isMutating },
    filters: {
      search: { query: searchQuery, setQuery: setSearchQuery },
      category,
      brand,
      clearAll: clearFilters,
    },
    operations: {
      createProduct,
      updateProduct,
      setProductToEdit,
      refetch,
      handleToggleProducts,
    },
  } = useProductData({ initialPage: 1, pageSize: 10 });

  // Open modal for editing product
  const handleEditProduct = useCallback(
    (product) => {
      setIsEditing(true);
      setProductToEdit(product);
      setFormData({
        productName: product.productName,
        description: product.description,
        categoryId: product.categoryId,
        taxCode: product.taxCode,
        images: product.images || [],
        brandID: product.brandID,
        price: product.price,
        stockQty: product.stockQty,
        discountPrice: product.discountPrice,
        variants: product.variants || [],
        isTrending: product.isTrending ?? false, 
      });
      setIsModalOpen(true);
    },
    [setProductToEdit]
  );

  const PRODUCT_TABLE_COLUMNS = useMemo(
    () => [
      {
        key: "images",
        className: "w-10",
        header: "Image",
        render: (product) => (
          <ImageCell
            images={product.images}
            name={product.categoryName}
            isActive={product.isActive}
          />
        ),
      },
      {
        key: "productName",
        className: "w-40",
        header: "Name",
        render: (product) => <ProductNameCell product={product} />,
      },
      {
        key: "stockQty",
        className: "w-40",
        header: "Qauntity",
        render: (product) => (
          <span
            className={`${
              product.isActive ? `opacity-100` : `opacity-50`
            } transition-all
              duration-300`}
          >
            {product.stockQty}
          </span>
        ),
      },
      {
        key: "price",
        header: "Prize",
        className: "w-40",
        render: (product) => (
          <span
            className={` ${product.isActive ? `opacity-100` : `opacity-50`}  ${
              product.price ? `text-gray-800` : `text-gray-400 font-normal`
            } transition-all duration-300`}
          >
            {product.price ? product.price : "NA"}
          </span>
        ),
      },
      
      {
        key: "variants",
        header: "Variants",

        render: (products) => (
          <span
            className={`${products.isActive ? `opacity-100` : `opacity-50`} ${
              products.variants?.length
                ? `text-gray-800`
                : `text-gray-400 font-normal`
            } transition-all duration-300`}
          >
            {products?.variants?.length || "NA"}
          </span>
        ),
      },

      {
        key: "taxCode",
        header: "TaxCode",
        className: "w-40",
        render: (product) => (
          <span
            className={`${product.isActive ? `opacity-100` : `opacity-50`} ${
              product.taxCode !== ""
                ? `text-gray-600 font-mono font-semibold `
                : `text-gray-400 font-normal`
            } transition-all duration-300`}
          >
            {product.taxCode !== "" ? product.taxCode : "NA"}
          </span>
        ),
      },
      {
        key: "isActive",
        header: "Active",
        render: (product) => (
          <div
            onClick={() => handleToggleProducts(product.productId,product.isActive)}
            className="relative cursor-pointer"
          >
            <input
              type="checkbox"
              className="sr-only"
              defaultChecked={product.isActive}
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors ${
                product.isActive ? "bg-black" : "bg-gray-300"
              }`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                product.isActive ? "transform translate-x-6" : ""
              }`}
            />
          </div>
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (product) => (
          <div className="flex space-x-2 pl-4">
            <button
              onClick={() => handleEditProduct(product)}
              className="text-black cursor-pointer hover:text-gray-400"
            >
              <Edit2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [handleEditProduct]
  );

  // Open modal for adding new product
  const handleAddProduct = useCallback(() => {
    setIsEditing(false);
    setProductToEdit(null);
    setFormData(INITIAL_PRODUCT_DETAILS);
    setIsModalOpen(true);
  }, [setProductToEdit]);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setFormData(INITIAL_PRODUCT_DETAILS);
  }, []);

  // Update handleSubmit function to better handle loading state
  const handleSubmit = useCallback(async () => {
    try {
      if (isEditing) {
        // For editing a product
        await updateProduct(formData);
      } else {
        // For adding a new product
        await createProduct(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      // Consider showing error message to the user here
    }
  }, [isEditing, formData, updateProduct, createProduct]);
  
  // Delete selected products
  const handleDeleteSelected = async () => {
    try {
      // Reset any previous error
      setDeleteError(null);
      setSelectedProducts([]);
      setIsDeleteModalVisible(false);
      refetch();
    } catch (error) {
      setDeleteError(error);
    }
  };
       
  // Reset error when closing the delete modal
  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalVisible(false);
    setDeleteError(null);
  }, []);

  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <div className="flex items-center gap-x-2 relative">
        <PageHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search products by name"
          viewToggle={null}
          actionButton={{
            label: "Add Product",
            onClick: handleAddProduct,
            icon: <PlusCircle size={16} />,
          }}
        />
        <ProductFilter
          searchQuery={searchQuery}
          categories={categories}
          brands={brands}
          filters={{
            category,
            brand,
            clearAll: clearFilters,
          }}
        />
        <ActiveFilter
          brand={brand}
          brands={brands}
          categories={categories}
          category={category}
          isActive={category.value || brand.value}
          clearFilters={clearFilters}
        />
      </div>
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        columns={PRODUCT_TABLE_COLUMNS}
        selectedItems={selectedProducts}
        setSelectedItems={setSelectedProducts}
        idField="productId"
        data={processedProducts || []}
        emptyMessage="No products found"
      />
      <PageNavigation
        currentPage={currentPage}
        data={productsData}
        setCurrentPage={handlePageChange}
        totalPages={totalPages}
        pageSize={pageSize}
      />
      <ProductModal
        isLoading={isMutating}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        brands={brands}
        colors={colors}
        sizes={sizes}
      />
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isVisible={isDeleteModalVisible}
        selected={selectedProducts}
        setVisible={handleCloseDeleteModal}
        isOpen={selectedProducts.length > 0}
        handleDelete={handleDeleteSelected}
        title={"Delete Products"}
        isError={!!deleteError}
        error={deleteError}
      />

      {/* Floating Action Button to trigger delete modal */}
      {selectedProducts.length > 0 && (
        <FloatingDeleteButton onClick={() => setIsDeleteModalVisible(true)} />
      )}
    </div>
  );
};

export default ProductList;
