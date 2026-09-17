import React from "react";
import FormModal from "../shared/FormModal";
import ImageUploader from "../shared/ImageUploader";

const BrandModal = ({
  isLoading,
  isModalOpen,
  handleCloseModal,
  isEditing,
  handleSubmit,
  formData,
  handleInputChange,
  handleImageUploaded,
}) => {
  // Handle toggle change specifically since it's a boolean value
  const handleToggleChange = () => {
    handleInputChange({
      target: {
        name: "isActive",
        value: !formData.isActive,
      },
    });
  };
  return (
    <FormModal
      isLoading={isLoading}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={isEditing ? "Edit Brand" : "Add New Brand"}
      handleSubmit={handleSubmit}
    >
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Brand Image
        </label>
        <ImageUploader
          maxHeight={3000}
          max_Width={3000}
          aspectRatio="aspect-auto"
          maxWidth="max-w-full"
          initialImage={formData.imageUrl}
          onImageUpload={handleImageUploaded}
          containerClassName="max-w-full"
          category="brand"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Name
        </label>
        <input
          type="text"
          name="brandName"
          value={formData.brandName}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter brand name"
          required
        />
      </div>

      {/* Toggle button for active status */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={formData.isActive}
              onChange={handleToggleChange}
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors ${
                formData.isActive ? "bg-black " : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                formData.isActive ? "transform translate-x-6" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {formData.isActive ? "Active" : "Inactive"}
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {formData.isActive
            ? "This brand will be visible to customers"
            : "This brand will be hidden from customers"}
        </p>
      </div>
    </FormModal>
  );
};

export default BrandModal;
