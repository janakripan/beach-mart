import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
// Components
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import ProductModal from '../../components/admin/shared/products/ProductModal';
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import ConfirmModal from "../../components/admin/shared/shared/ConfirmModal";
import { useGetProducts, useGetCategories, useAddProducts, useEditProduct, useGetVariants, useActiveProduct, useDeleteProduct } from "../../api/admin/hooks";
import { queryClient } from "../../utils/queryClient";

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch data
  const { data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetProducts({
    page: currentPage,
    pageSize,
  });
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();
  const { data: variantsList = [], isLoading: isLoadingVariants } = useGetVariants();

  // Log to console as requested
  useEffect(() => {
    if (productsData?.products) {
      console.log("Fetched Products:", productsData.products);
    }
    if (categories.length > 0) {
      console.log("Fetched Categories:", categories);
    }
  }, [productsData, categories]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

  const rawProducts = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;

  // Search filter (client-side for now, but API has productName param we could use)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return rawProducts;
    return rawProducts.filter(p => p.ProductName?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rawProducts, searchQuery]);

  // Handlers moved below to access mutations

  const { mutate: deleteProductMutation } = useDeleteProduct();

  const handleDeleteProduct = (productId) => {
    setDeleteModal({ isOpen: true, productId });
  };

  const confirmDelete = () => {
    if (deleteModal.productId) {
      deleteProductMutation(deleteModal.productId, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProducts"] });
          setDeleteModal({ isOpen: false, productId: null });
          toast.success("Product deleted successfully");
        },
        onError: (err) => {
          console.error("Failed to delete product", err);
          setDeleteModal({ isOpen: false, productId: null });
          toast.error("Failed to delete product");
        }
      });
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setFormData({
      ...product,
      id: product.ProductID,
      name: product.ProductName,
      description: product.Description,
      categoryName: product.Categorie,
      price: product.Price,
      discountPrice: product.Discount,
      discountType: product.DiscMode === "Fixed" ? "fixed" : "percentage",
      images: [
        product.ImageUrl1 || null,
        product.ImageUrl2 || null,
        product.ImageUrl3 || null,
        product.ImageUrl4 || null,
        product.ImageUrl5 || null,
      ],
      variants: product.ProductVariants || [],
      enableVariant: product.ProductVariants && product.ProductVariants.length > 0
    });
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      description: "",
      categoryName: "",
      price: "",
      discountPrice: "",
      discountType: "percentage",
      images: [null, null, null, null, null],
      variants: []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const { mutate: addProductMutation } = useAddProducts();
  const { mutate: editProductMutation } = useEditProduct();
  const { mutate: activeProductMutation } = useActiveProduct();

  const handleToggleProduct = (product) => {
    activeProductMutation(
      { productId: product.ProductID, status: product.IsActive },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProducts"] });
          toast.success(product.IsActive ? "Product deactivated" : "Product activated");
        },
        onError: (err) => {
          console.error("Failed to toggle product status", err);
          toast.error("Failed to update product status");
        }
      }
    );
  };

  const handleSubmit = (newData) => {
    const categoryId = Number(newData.categoryName) || newData.categoryName;

    const payload = {
      ProductName: newData.name,
      Description: newData.description,
      Categorie: categoryId,
      Price: Number(newData.price) || 0,
      Discount: Number(newData.discountPrice) || 0,
      DiscMode: newData.discountType === "fixed" ? "Fixed" : "Percentage",
      IsCustomizable: false,
      ImageUrl1: newData.images && newData.images[0] ? newData.images[0] : null,
      ImageUrl2: newData.images && newData.images[1] ? newData.images[1] : null,
      ImageUrl3: newData.images && newData.images[2] ? newData.images[2] : null,
      ImageUrl4: newData.images && newData.images[3] ? newData.images[3] : null,
      ImageUrl5: newData.images && newData.images[4] ? newData.images[4] : null,
      ImageUrl6: null,
      SecondaryName: null,
      ProductVariants: newData.variants?.map(v => ({
        VariantName: v.variantName || v.VariantName,
        variantID: v.variantID || 0,
        Price: v.price || v.Price,
        IsStock: true
      })) || []
    };

    if (isEditing) {
      editProductMutation(
        { updatedProduct: payload, productId: newData.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getProducts"] });
            handleCloseModal();
            toast.success("Product updated successfully");
          },
          onError: (err) => {
            console.error("Failed to edit product", err);
            toast.error("Failed to update product");
          }
        }
      );
    } else {
      addProductMutation(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getProducts"] });
          handleCloseModal();
          toast.success("Product added successfully");
        },
        onError: (err) => {
          console.error("Failed to add product", err);
          toast.error("Failed to add product");
        }
      });
    }
  };

  const PRODUCT_TABLE_COLUMNS = [
    {
      key: "image",
      className: "w-16",
      header: "Image",
      render: (product) => (
        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.ImageUrl1 ? (
            <img src={product.ImageUrl1} alt={product.ProductName} className="h-full w-full object-cover" />
          ) : (
            <span className="text-gray-400 text-xs">No img</span>
          )}
        </div>
      ),
    },
    {
      key: "name",
      className: "w-40 font-medium text-[#1A1A2E]",
      header: "Name",
      render: (product) => product.ProductName
    },
    {
      key: "categoryName",
      header: "Category",
      className: "w-40 text-sm text-gray-500",
      render: (product) => {
        // Fallback checks for common category ID property names
        const catId = product.Categorie || product.CategoryID || product.CategoryId;
        const matchedCategory = categories.find(
          c => c.CategoryID === catId || c.categoryId === catId || c.id === catId || c.Categorie === catId
        );
        return matchedCategory ? (matchedCategory.CategoryName || matchedCategory.categoryName || matchedCategory.Name) : `ID: ${catId || 'Unknown'}`;
      }
    },
    {
      key: "price",
      header: "Price",
      className: "w-24 font-semibold text-[#1A1A2E]",
      render: (product) => `AED ${product.Price || 0}`
    },
    {
      key: "discount",
      header: "Discount",
      className: "w-24 text-sm text-primary",
      render: (product) => product.Discount ? `AED ${product.Discount}` : "-"
    },
    {
      key: "isActive",
      header: "Active",
      render: (product) => (
        <div onClick={(e) => { e.stopPropagation(); handleToggleProduct(product); }} className="relative cursor-pointer">
          <input type="checkbox" className="sr-only" checked={product.IsActive} readOnly />
          <div className={`block w-10 h-5 rounded-full transition-colors ${product.IsActive ? "bg-primary" : "bg-gray-300"}`} />
          <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${product.IsActive ? "transform translate-x-5" : ""}`} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (product) => (
        <div className="flex space-x-3 items-center" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => handleDeleteProduct(product.ProductID)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100">
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5 bg-[#F8FCF8]">
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
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <DynamicTable
          isLoading={isLoadingProducts || isLoadingCategories}
          isError={isErrorProducts}
          columns={PRODUCT_TABLE_COLUMNS}
          selectedItems={[]}
          setSelectedItems={() => {}}
          idField="ProductID"
          data={filteredProducts}
          emptyMessage="No products found"
          onRowClick={(product) => handleEditProduct(product)}
        />
      </div>
      
      <PageNavigation
        currentPage={currentPage}
        data={{ hasMore: currentPage < totalPages }}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
      />
      
      {isModalOpen && (
        <ProductModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          isEditing={isEditing}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          variantsList={variantsList}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default ProductList;
