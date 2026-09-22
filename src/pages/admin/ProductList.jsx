import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
// Constants
import { offerProducts, vegetableProducts, categories } from "../../constants/data";
// Components
import PageNavigation from "../../components/admin/shared/products/PageNavigation";
import ProductModal from '../../components/admin/shared/products/ProductModal';
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";

// Mock mapping
const initialProducts = [
  ...offerProducts.map(p => ({ ...p, categoryName: 'Fresh Fruit', discountPrice: '0.00', isActive: true })),
  ...vegetableProducts.map(p => ({ ...p, categoryName: 'Fresh Vegetables', discountPrice: '0.00', isActive: true }))
];

const ProductList = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter products by search
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleProduct = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
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
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
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
      render: (product) => product.name
    },
    {
      key: "categoryName",
      header: "Category",
      className: "w-40 text-sm text-gray-500",
      render: (product) => product.categoryName
    },
    {
      key: "price",
      header: "Price",
      className: "w-24 font-semibold text-[#1A1A2E]",
      render: (product) => `AED ${product.price}`
    },
    {
      key: "discount",
      header: "Discount",
      className: "w-24 text-sm text-primary",
      render: (product) => product.discountPrice !== "0.00" && product.discountPrice ? `AED ${product.discountPrice}` : "-"
    },
    {
      key: "isActive",
      header: "Active",
      render: (product) => (
        <div onClick={() => handleToggleProduct(product.id)} className="relative cursor-pointer">
          <input type="checkbox" className="sr-only" checked={product.isActive} readOnly />
          <div className={`block w-10 h-5 rounded-full transition-colors ${product.isActive ? "bg-primary" : "bg-gray-300"}`} />
          <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${product.isActive ? "transform translate-x-5" : ""}`} />
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
          <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition-colors">
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
          isLoading={false}
          isError={false}
          columns={PRODUCT_TABLE_COLUMNS}
          selectedItems={[]}
          setSelectedItems={() => {}}
          idField="id"
          data={paginatedProducts}
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
