import { LayoutGrid, PlusCircle, Table, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useDeleteBrand,
  useEditBrand,
  useGetBrand,
  usePostBrand,
} from "../../api/admin/hooks";
import BrandList from "../../components/admin/shared/brand/BrandList";
import BrandModal from "../../components/admin/shared/brand/BrandModal";
import DeleteModal from "../../components/admin/shared/shared/DeleteModal"; 
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import FloatingDeleteButton from "../../components/admin/shared/shared/FloatingDeleteButton";

const Brands = () => { 
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  const [gridView, setGridView] = useState(() => {
    const savedView = localStorage.getItem("gridViewBrand");
    return savedView === "true";
  });
  const [formData, setFormData] = useState({
    brandName: "",
    isActive: true,
    imageUrl: "",
  });

  // State for selected brand
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch brand
  const { data: brand, refetch } = useGetBrand();

  // Mutations
  const addBrand = usePostBrand();
  const editBrand = useEditBrand();
  const deleteBrand = useDeleteBrand();

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
  const handleAddBrand = () => {
    setIsEditing(false);
    setCurrentBrand(null);
    setFormData({ name: "", description: "", imageUrl: "" });
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEditBrand = (brand) => {
    setIsEditing(true);
    setCurrentBrand(brand);
    setFormData({
      brandName: brand.Name,
      imageUrl: brand.ImageUrl,
      isActive: brand.IsActive,
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
      if (isEditing && currentBrand) {
        await editBrand.mutateAsync({
          updatedBrand: formData,
          brandId: currentBrand.Id,
        });
      } else {
        await addBrand.mutateAsync(formData);
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // Delete selected brand
  const handleDeleteSelected = async () => {
    try {
      // Reset any previous error
      setDeleteError(null);

      // Create an array of promises for each delete operation
      const deletePromises = selectedBrand.map((brandId) =>
        deleteBrand.mutateAsync(brandId).catch((error) => {
          // Capture the error properly
          throw error; // Re-throw to be caught by the outer catch block
        })
      );

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);

      // Refresh data and clear selection
      refetch();
      setSelectedBrand([]);
      setIsDeleteModalVisible(false);
    } catch (error) {
      setDeleteError(error);
    }
  };

  // Reset error when closing the modal
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setDeleteError(null);
  };

  // Filter brand based on search query
  const filteredBrand = brand
    ? brand.filter((brand) =>
        brand.Name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Track grid view
  useEffect(() => {
    localStorage.setItem("gridViewBrand", gridView);
  }, [gridView]);

  return (
    <div className="w-full h-screen overflow-hidden gap-y-4 flex flex-col p-5">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search here by brand name"
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
          onClick: handleAddBrand,
          label: "Add Brand",
          icon: <PlusCircle size={16} />,
        }}
      />

      <BrandList
        filteredBrand={filteredBrand}
        gridView={gridView}
        handleEditBrand={handleEditBrand}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />

      {/* Category Modal - appears at the right */}
      <BrandModal
        formData={formData}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        handleImageUploaded={handleImageUploaded}
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        isLoading={addBrand.isLoading || editBrand.isLoading}
      />

      {/* Delete Confirmation Modal - appears at the bottom right */}
      <DeleteModal
        isVisible={isDeleteModalVisible}
        selected={selectedBrand}
        setVisible={handleCloseDeleteModal}
        isOpen={selectedBrand.length > 0}
        handleDelete={handleDeleteSelected}
        title={"Delete Brands"}
        isError={!!deleteError}
        error={deleteError}
      />

      {/* Floating Action Button to trigger delete modal */}
      {selectedBrand.length > 0 && (
        <FloatingDeleteButton onClick={() => setIsDeleteModalVisible(true)} />
      )}
    </div>
  );
};

export default Brands;
