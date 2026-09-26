import React, { useEffect, useState } from "react";
import FormModal from "../shared/FormModal";
import ImageUploader from "../../../shared/ImageUploader";

const CategoryModal = ({
  isOpen,
  handleSubmit,
  onClose,
  isEditing,
  formData,
  handleInputChange,
  handleImageUploaded,
  handleRemoveImage,
  isLoading,
}) => {
  const handleMainToggleChange = () => {
    handleInputChange({
      target: {
        name: "isMain",
        value: !formData.isMain,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add New Category"}
    >
      <div className="w-full">
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          Category Image
        </label>
        <div className="w-[200px]">
          <ImageUploader
            initialImage={formData.imageUrl}
            onImageUpload={handleImageUploaded}
            onImageDelete={handleRemoveImage}
            category="categories"
            aspectRatio="aspect-square"
            minWidth={300}
            minHeight={300}
            max_Width={800}
            maxHeight={800}
            maxWidth="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          Category Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border border-[#E3F0E2] bg-[#F8FCF8] rounded-[12px] p-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-primary transition-colors"
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border border-[#E3F0E2] bg-[#F8FCF8] rounded-[12px] p-3 text-sm text-[#1A1A2E] focus:outline-none focus:border-primary transition-colors"
          placeholder="Enter category description"
          rows="3"
        />
      </div>

      <div className="flex gap-8">
        {/* Toggle button for main status */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={!!formData.isMain}
                onChange={handleMainToggleChange}
              />
              <div
                className={`block w-12 h-6 rounded-full transition-colors ${
                  formData.isMain ? "bg-primary " : "bg-[#E3F0E2]"
                }`}
              ></div>
              <div
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                  formData.isMain ? "transform translate-x-6" : ""
                }`}
              ></div>
            </div>
            <span className="text-sm font-medium text-[#1A1A2E]">
              {formData.isMain ? "Master Category" : "Sub Category"}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {formData.isMain
              ? "This category will show on home page." 
              : "This category wont show on home page."}
          </p>
        </div>
      </div>
    </FormModal>
  );
};

export default CategoryModal;
