import { LayoutGrid, PlusCircle, Table, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import CategoryList from "../../components/admin/shared/category/CategoryList";
import CategoryModal from "../../components/admin/shared/category/CategoryModal";
import DeleteModal from "../../components/admin/shared/shared/DeleteModal";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import FloatingDeleteButton from "../../components/admin/shared/shared/FloatingDeleteButton";
import { useAppStore } from "../../store/appStore";

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [gridView, setGridView] = useState(() => {
    const savedView = localStorage.getItem("gridView");
    return savedView === "true";
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    IsActive: true,
    isMain: false,
  });

  // State for selected categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deletedError, setDeleteError] = useState(null);

  // Local categories state
  const [categories, setCategories] = useState([]);
  
  // Loading state for UX
  const fetchedCategories = useAppStore(state => state.categories);
  const isFetching = !fetchedCategories || fetchedCategories.length === 0;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (fetchedCategories && fetchedCategories.length > 0) {
      const mapped = fetchedCategories.map((c) => ({
        Id: c.CategoryID || c.CategorieID,
        Name: c.CategoryName || c.CategorieName,
        CategoryDescription: c.Description || "",
        ImageUrl: c.ImageUrl,
        IsActive: c.IsActive !== undefined ? c.IsActive : true,
        isMain: false,
        ParentCategoryId: null,
      }));
      setCategories(mapped);
    }
  }, [fetchedCategories]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUploaded = (data) => {
    if (data && data.FileDetails) {
      setFormData((prev) => ({
        ...prev,
        imageUrl: data.FileDetails[0].FileUrl,
      }));
    }
  };

  // Open modal for adding new category
  const handleAddCategory = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    setFormData({ name: "", description: "", imageUrl: "", IsActive: true, isMain: false });
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEditCategory = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setFormData({
      name: category.Name,
      description: category.CategoryDescription,
      imageUrl: category.ImageUrl,
      parentId: category.ParentCategoryId,
      IsActive: category.IsActive,
      isMain: category.isMain !== undefined ? category.isMain : (category.IsMain || false),
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Submit form (create or update) locally
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditing && currentCategory) {
        setCategories(prev => prev.map(c => {
          if (c.Id === currentCategory.Id) {
            return {
              ...c,
              Name: formData.name,
              CategoryDescription: formData.description,
              ImageUrl: formData.imageUrl,
              IsActive: formData.IsActive,
              isMain: formData.isMain,
            };
          }
          return c;
        }));
      } else {
        const newCategory = {
          Id: `cat-${Date.now()}`,
          Name: formData.name,
          CategoryDescription: formData.description,
          ImageUrl: formData.imageUrl,
          IsActive: formData.IsActive,
          isMain: formData.isMain,
          ParentCategoryId: null,
        };
        setCategories(prev => [...prev, newCategory]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete selected categories locally
  const handleDeleteSelected = async () => {
    try {
      setDeleteError(null);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setCategories(prev => prev.filter(c => !selectedCategories.includes(c.Id)));

      setSelectedCategories([]);
      setIsDeleteModalVisible(false);
    } catch (error) {
      setDeleteError(error);
      console.error("Error deleting categories:", error);
    }
  };
  
  // Handle order update locally
  const handleReorder = (newCategories) => {
    setCategories(newCategories);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setDeleteError(null);
  };

  // Filter categories based on search query
  const filteredCategories = categories
    ? categories.filter((category) =>
        category.Name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Track grid veiw
  useEffect(() => {
    localStorage.setItem("gridView", gridView);
  }, [gridView]);
  
  return (
    <div className="w-full h-screen overflow-hidden gap-y-4 flex flex-col p-5" data-lenis-prevent="true">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search here by category name"
        viewToggle={{
          isGridView: gridView,
          setViewMode: setGridView,
          gridIcon: (
            <Table className="text-gray-500 group-hover:text-black" />
          ),
          alternateIcon: (
            <LayoutGrid className="text-gray-500 group-hover:text-black" />
          ),
        }}
        actionButton={{
          onClick: handleAddCategory,
          label: "Add Category",
          icon: <PlusCircle size={16} />,
        }}
      />

      <CategoryList
        filteredCategories={filteredCategories}
        gridView={gridView}
        handleEditCategory={handleEditCategory}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onReorder={handleReorder}
      />

      {/* Category Modal - appears at the right */}
      <CategoryModal
        isOpen={isModalOpen}
        handleSubmit={handleSubmit}
        onClose={handleCloseModal}
        isEditing={isEditing}
        formData={formData}
        handleInputChange={handleInputChange}
        handleImageUploaded={handleImageUploaded}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal - appears at the bottom right */}
      <DeleteModal
        isVisible={isDeleteModalVisible}
        selected={selectedCategories}
        setVisible={handleCloseDeleteModal}
        isOpen={selectedCategories.length > 0}
        handleDelete={handleDeleteSelected}
        isError={!!deletedError}
        error={deletedError}
        title={"Delete Categories"}
      />

      {/* Floating Action Button to trigger delete modal */}
      {selectedCategories.length > 0 && (
        <FloatingDeleteButton onClick={() => setIsDeleteModalVisible(true)} />
      )}
    </div>
  );
};

export default Categories;

