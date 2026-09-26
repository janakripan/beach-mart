import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
// Components
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import ProductModal from '../../components/admin/shared/products/ProductModal';
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { useGetProducts, useGetCategories } from "../../api/admin/hooks";

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

  const rawProducts = productsData?.products || [];
  const totalPages = productsData?.totalPages || 1;

  // Search filter (client-side for now, but API has productName param we could use)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return rawProducts;
    return rawProducts.filter(p => p.ProductName?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rawProducts, searchQuery]);

  const handleToggleProduct = (productId) => {
    // API integration needed for toggle
    console.log("Toggle product", productId);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      // API integration needed for delete
      console.log("Delete product", productId);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setFormData(product);
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
      image: null,
      variants: []
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(null);
  };

  const handleSubmit = (newData) => {
    if (isEditing) {
      setProducts(prev => prev.map(p => p.id === newData.id ? newData : p));
    } else {
      setProducts(prev => [{...newData, id: `new-${Date.now()}`, isActive: true}, ...prev]);
    }
    handleCloseModal();
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
        <div onClick={() => handleToggleProduct(product.ProductID)} className="relative cursor-pointer">
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
        <div className="flex space-x-3 items-center">
          <button onClick={() => handleEditProduct(product)} className="text-gray-400 hover:text-primary transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDeleteProduct(product.ProductID)} className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
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
        />
      )}
    </div>
  );
};

export default ProductList;
