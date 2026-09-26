import React from "react";
import ImageUploader from "../../../shared/ImageUploader";
import RichTextEditor from "./RichTextEditor";

const ProductInformation = ({
  formData,
  setFormData,
  setEnableVariants,
  enableVariants,
  categories,
  formik,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formik) formik.setFieldValue(name, value);
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
    if (formik) formik.setFieldValue("description", content);
  };

  const handleImageUploaded = (data) => {
    if (data && data.FileDetails) {
      const newImageUrl = data.FileDetails[0].FileUrl;
      setFormData((prev) => ({ ...prev, image: newImageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const toggleVariants = () => {
    setEnableVariants(true);
    setFormData((prev) => ({ ...prev, enableVariant: true }));
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Product Image</label>
        <ImageUploader
          maxHeight={3000} 
          max_Width={3000} 
          aspectRatio="aspect-auto"
          maxWidth="max-w-full"
          initialImage={formData.image}
          onImageUpload={handleImageUploaded}
          onImageDelete={handleRemoveImage}
          containerClassName="max-[250px]"
          category="product"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
          placeholder="Enter product name"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Description</label>
        <div className="border-2 border-[#E3F0E2] rounded-md overflow-hidden">
          <RichTextEditor
            value={formData.description || ""}
            onChange={handleDescriptionChange}
            placeholder="Enter product description"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Category</label>
          <select
            name="categoryName"
            value={formData.categoryName || ""}
            onChange={handleInputChange}
            className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Select Category</option>
            {categories && categories.map((cat) => (
              <option key={cat.id} value={cat.title}>{cat.title}</option>
            ))}
          </select>
        </div>
        
        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Base Price (AED)</label>
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleInputChange}
            className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Discount Type</label>
          <div className="flex items-center space-x-6 mt-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="discountType"
                value="percentage"
                checked={formData.discountType === "percentage"}
                onChange={handleInputChange}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm text-[#1A1A2E]">Percentage</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="discountType"
                value="fixed"
                checked={formData.discountType === "fixed"}
                onChange={handleInputChange}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <span className="text-sm text-[#1A1A2E]">Fixed Price</span>
            </label>
          </div>
        </div>

        {/* Discount Amount */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
            Discount Amount {formData.discountType === "percentage" ? "(percentage)" : "(amount)"}
          </label>
          <input
            type="number"
            name="discountPrice"
            value={formData.discountPrice || ""}
            onChange={handleInputChange}
            className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder="0"
          />
        </div>
      </div>

      {/* Add Variants Button */}
      {!enableVariants && (
        <div className="pt-4 border-t border-[#E3F0E2]">
          <button
            type="button"
            onClick={toggleVariants}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Add Variants
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductInformation;
