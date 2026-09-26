import React from "react";
import { AlertTriangle } from "lucide-react";
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

  const handleImageUploaded = (data, index) => {
    if (data && data.FileDetails) {
      const newImageUrl = data.FileDetails[0].FileUrl;
      setFormData((prev) => {
        const newImages = [...(prev.images || [null, null, null, null, null])];
        newImages[index] = newImageUrl;
        return { ...prev, images: newImages };
      });
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const currentImages = prev.images || [null, null, null, null, null];
      // Keep all images except the one at the deleted index
      const remainingImages = currentImages.filter((_, i) => i !== index && currentImages[i] !== null);
      // Pad with nulls up to 5 elements
      const newImages = [...remainingImages, null, null, null, null, null].slice(0, 5);
      return { ...prev, images: newImages };
    });
  };

  const toggleVariants = () => {
    setEnableVariants(true);
    setFormData((prev) => ({ ...prev, enableVariant: true }));
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Product Images (Max 5)</label>
        <div className="flex flex-wrap gap-4">
          {[0, 1, 2, 3, 4].map((index) => {
            const hasImage = formData.images && !!formData.images[index];
            const isFirstEmpty = formData.images && index === formData.images.findIndex(img => !img);
            if (!hasImage && !isFirstEmpty && formData.images && formData.images.some(img => !img)) {
              return null; // hide subsequent empty boxes
            }
            return (
              <div key={index} className="w-32 sm:w-36 flex-shrink-0">
                <ImageUploader
                  maxHeight={3000} 
                  max_Width={3000} 
                  aspectRatio="aspect-square"
                  maxWidth="max-w-full"
                  initialImage={formData.images && formData.images[index] ? formData.images[index] : null}
                  onImageUpload={(data) => handleImageUploaded(data, index)}
                  onImageDelete={() => handleRemoveImage(index)}
                  containerClassName="w-full"
                  category="products"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          onBlur={formik?.handleBlur}
          className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none ${formik?.errors.name && formik?.touched.name ? 'border-red-400 focus:border-red-500' : 'border-[#E3F0E2] focus:border-primary'}`}
          placeholder="Enter product name"
        />
        {formik?.errors.name && formik?.touched.name && (
          <div className="mt-2 text-red-600 text-xs flex items-center">
            <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
            {formik.errors.name}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Description</label>
        <div className={`border-2 rounded-md overflow-hidden ${formik?.errors.description && formik?.touched.description ? 'border-red-400' : 'border-[#E3F0E2]'}`}>
          <RichTextEditor
            value={formData.description || ""}
            onChange={handleDescriptionChange}
            onBlur={() => formik?.setFieldTouched("description", true)}
            placeholder="Enter product description"
          />
        </div>
        {formik?.errors.description && formik?.touched.description && (
          <div className="mt-2 text-red-600 text-xs flex items-center">
            <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
            {formik.errors.description}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Category</label>
          <select
            name="categoryName"
            value={formData.categoryName || ""}
            onChange={handleInputChange}
            onBlur={formik?.handleBlur}
            className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none ${formik?.errors.categoryName && formik?.touched.categoryName ? 'border-red-400 focus:border-red-500' : 'border-[#E3F0E2] focus:border-primary'}`}
          >
            <option value="">Select Category</option>
            {categories && categories.map((cat) => {
              const catId = cat.CategoryID || cat.id;
              const catName = cat.CategoryName || cat.title;
              return (
                <option key={catId} value={catId}>{catName}</option>
              );
            })}
          </select>
          {formik?.errors.categoryName && formik?.touched.categoryName && (
            <div className="mt-2 text-red-600 text-xs flex items-center">
              <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
              {formik.errors.categoryName}
            </div>
          )}
        </div>
        
        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Base Price (AED)</label>
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleInputChange}
            onBlur={formik?.handleBlur}
            className={`w-full border-2 rounded-md p-2.5 text-sm focus:outline-none ${formik?.errors.price && formik?.touched.price ? 'border-red-400 focus:border-red-500' : 'border-[#E3F0E2] focus:border-primary'}`}
            placeholder="0.00"
            disabled={enableVariants}
          />
          {formik?.errors.price && formik?.touched.price && !enableVariants && (
            <div className="mt-2 text-red-600 text-xs flex items-center">
              <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
              {formik.errors.price}
            </div>
          )}
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
