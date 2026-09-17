import { LayoutGrid, PlusCircle, Table, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useDeleteCategory,
  useGetAllCategory,
  usePostCategory,
  usePutCategory,
} from "../../api/admin/hooks";
import CategoryList from "../../components/admin/shared/category/CategoryList";
import CategoryModal from "../../components/admin/shared/category/CategoryModal";
import DeleteModal from "../../components/admin/shared/shared/DeleteModal";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import FloatingDeleteButton from "../../components/admin/shared/shared/FloatingDeleteButton";

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

  // Fetch categories
  const { data: categories, refetch } = useGetAllCategory();

  // Mutations
  const postCategory = usePostCategory();
  const putCategory = usePutCategory();
  const deleteCategory = useDeleteCategory();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUploaded = (data) => {
    // Assuming the API returns an imageUrl field
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
      isMain: category.IsMain !== undefined ? category.IsMain : (category.isMain || false),
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentCategory) {
        await putCategory.mutateAsync({
          category: formData,
          categoryId: currentCategory.Id,
        });
      } else {
        await postCategory.mutateAsync(formData);
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Delete selected categories
  const handleDeleteSelected = async () => {
    try {
      setDeleteError(null);
      // Create an array of promises for each delete operation
      const deletePromises = selectedCategories.map((categoryId) =>
        deleteCategory.mutateAsync(categoryId)
      );

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);

      // Refresh data and clear selection
      refetch();
      setSelectedCategories([]);
      setIsDeleteModalVisible(false);
    } catch (error) {
      setDeleteError(error);

      console.error("Error deleting categories:", error);
    }
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
    <div className="w-full h-screen overflow-hidden gap-y-4 flex flex-col p-5">
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
        isLoading={postCategory.isLoading || putCategory.isLoading}
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
