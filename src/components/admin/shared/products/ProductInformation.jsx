import React from "react";
import ImageUploader from "../shared/ImageUploader";
import RichTextEditor from "./RichTextEditor";

const ProductInformation = ({
  formData,
  setFormData,
  setEnableVariants,
  enableVariants,
  categories,
  brands,
  formik,
}) => {
  // Handle input change for main product
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update formik values as well
    formik.setFieldValue(name, value);
  };
  // Handle number input specifically for price fields
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));

    // Update formik values as well
    formik.setFieldValue(name, value);
  };
  // Handle rich text editor change
  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({ ...prev, description: content }));
    // Update formik values as well
    formik.setFieldValue("description", content);
  };
  // Handle toggle for variants
  const handleToggleVariants = () => {
    setEnableVariants(!enableVariants);

    // Reset variants array when disabling
    if (enableVariants) {
      setFormData((prev) => ({ ...prev, variants: [], enableVariant: true }));
    }
  };

  // Handle image upload for a specific slot
  const handleImageUploaded = (data, slotIndex) => {
    if (data && data.FileDetails) {
      const newImageUrl = data.FileDetails[0].FileUrl;

      setFormData((prev) => {
        // Create a copy of current images or initialize empty array
        const currentImages = [...(prev.images || [])];

        // Find if this slot already has an image
        const existingIndex = currentImages.findIndex(
          (img, i) => i === slotIndex
        );

        if (existingIndex >= 0) {
          // Update existing slot
          currentImages[existingIndex] = {
            ...currentImages[existingIndex],
            ImageUrl: newImageUrl,
          };
        } else {
          // Add new image at specific index
          currentImages[slotIndex] = {
            ImageUrl: newImageUrl,
            isPrimary: slotIndex === 0, // First slot is primary by default
          };
        }

        return { ...prev, images: currentImages };
      });
    }
  };

  // Set image as primary
  const setAsPrimary = (slotIndex) => {
    setFormData((prev) => {
      const updatedImages = (prev.images || []).map((img, i) => ({
        ...img,
        isPrimary: i === slotIndex,
      }));
      return { ...prev, images: updatedImages };
    });
  };

  // Remove an image from a specific slot
  const removeImage = (slotIndex) => {
    setFormData((prev) => {
      const currentImages = [...(prev.images || [])];

      // If removing the primary image and it's not the first slot
      if (currentImages[slotIndex]?.isPrimary && slotIndex !== 0) {
        // Set first image as primary if it exists
        if (currentImages[0]) {
          currentImages[0].isPrimary = true;
        }
      }

      // Remove the image at specified index
      currentImages[slotIndex] = null;

      // Filter out null values but maintain the same length
      const newImages = currentImages.filter((img) => img !== null);

      return { ...prev, images: newImages };
    });
  };

  // Get image URL for a specific slot if it exists
  const getImageUrlForSlot = (slotIndex) => {
    if (!formData.images || formData.images.length <= slotIndex) {
      return "";
    }
    return formData.images[slotIndex]?.imageUrl || "";
  };

  // Check if an image is primary
  const isImagePrimary = (slotIndex) => {
    if (!formData.images || formData.images.length <= slotIndex) {
      return slotIndex === 0; // Default first slot is primary
    }
    return formData.images[slotIndex]?.isPrimary || false;
  };

  // Determine the next available slot for image upload
  const getNextAvailableSlot = () => {
    if (!formData.images) return 0;

    // Find the first empty slot
    for (let i = 0; i < 4; i++) {
      const hasImage = formData.images.some(
        (img, index) => index === i && img?.ImageUrl
      );
      if (!hasImage) return i;
    }

    // If all slots are filled
    return 4;
  };

  // Check if a slot is available for upload
  const isSlotAvailable = (slotIndex) => {
    const nextAvailableSlot = getNextAvailableSlot();
    return slotIndex <= nextAvailableSlot;
  };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={formik.values.productName || ""}
          onChange={handleInputChange}
          onBlur={formik.handleBlur}
          className={`w-full border-2 rounded-md p-2 text-sm ${
            formik.touched.productName && formik.errors.productName
              ? "border-red-400"
              : "border-gray-300"
          }`}
          placeholder="Enter product name"
        />
        {formik.touched.productName && formik.errors.productName && (
          <div className="text-[10px] text-red-500 mt-1">
            {formik.errors.productName}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <RichTextEditor
          value={formData.description || ""}
          onChange={handleDescriptionChange}
          placeholder="Enter product description"
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-[10px] text-red-500 -translate-y-2">
            {formik.errors.description}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleInputChange}
            className={`w-full border-2 rounded-md p-2 text-sm ${
              formik.touched.categoryId && formik.errors.categoryId
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Category</option>
            {categories &&
              categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.Name}
                </option>
              ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <div className="text-[10px] text-red-500 mt-1">
              {formik.errors.categoryId}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            name="brandID"
            value={formData.brandID || ""}
            onChange={handleInputChange}
            className={`w-full border-2 rounded-md p-2 text-sm ${
              formik.touched.brandID && formik.errors.brandID
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            <option value="">Select Brand</option>
            {brands &&
              brands.map((brand) => (
                <option key={brand.Id} value={brand.Id}>
                  {brand.Name}
                </option>
              ))}
          </select>
          {formik.touched.brandID && formik.errors.brandID && (
            <div className="text-[10px] text-red-500 mt-1">
              {formik.errors.brandID}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Code
        </label>
        <input
          type="text"
          name="taxCode"
          value={formData.taxCode || ""}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter tax code"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Trending Product</span>

        <div
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              isTrending: !prev.isTrending,
            }))
          }
          className="relative cursor-pointer"
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={formData.isTrending}
            readOnly
          />

          <div
            className={`block w-12 h-6 rounded-full transition-colors ${
              formData.isTrending ? "bg-black" : "bg-gray-300"
            }`}
          />

          <div
            className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
              formData.isTrending ? "translate-x-6" : ""
            }`}
          />
        </div>
      </div>


      {/* Toggle for Variants */}
      <div className="pt-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={enableVariants}
              onChange={handleToggleVariants}
            />
            <div
              className={`block w-12 h-6 rounded-full transition-colors ${
                enableVariants ? "bg-black" : "bg-gray-300"
              }`}
            />
            <div
              className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                enableVariants ? "transform translate-x-6" : ""
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            Enable Variants
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Enable this option to add variants like color and size
        </p>
      </div>

      {/* Product Images - Only shown when variants are disabled */}
      {!enableVariants && (
        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={handleNumberInput}
                className={`w-full border-2 rounded-md p-2 text-sm ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-400"
                    : "border-gray-300"
                }`}
                step="0.01"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-xs text-red-500 mt-1">
                  {formik.errors.price}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice || ""}
                onChange={handleNumberInput}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQty"
                value={formData.stockQty || ""}
                onChange={handleNumberInput}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>

            {/* 2x2 Grid for 4 image upload slots */}
            <div className="grid grid-cols-2 gap-2">
              {/* Generate 4 image upload slots */}
              {[0, 1, 2, 3].map((slotIndex) => (
                <div
                  key={slotIndex}
                  className={`relative border rounded-md p-2 ${
                    !getImageUrlForSlot(slotIndex) &&
                    !isSlotAvailable(slotIndex)
                      ? "border-gray-200 bg-gray-100 opacity-60"
                      : "border-gray-300"
                  }`}
                >
                  <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Image {slotIndex + 1}
                      {!getImageUrlForSlot(slotIndex) &&
                        !isSlotAvailable(slotIndex) &&
                        " (Upload previous images first)"}
                    </span>
                    {getImageUrlForSlot(slotIndex) && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setAsPrimary(slotIndex)}
                          disabled={isImagePrimary(slotIndex)}
                          className={`text-xs px-2 py-1 rounded ${
                            isImagePrimary(slotIndex)
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 hover:bg-green-500 hover:text-white"
                          }`}
                        >
                          {isImagePrimary(slotIndex)
                            ? "Primary"
                            : "Set Primary"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(slotIndex)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white rounded px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {getImageUrlForSlot(slotIndex) ? (
                    <div className="relative w-full h-40">
                      <img
                        src={getImageUrlForSlot(slotIndex)}
                        alt={`Product ${slotIndex + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  ) : isSlotAvailable(slotIndex) ? (
                    <ImageUploader
                      maxHeight={3000}
                      max_Width={3000}
                      minHeight={300}
                      minWidth={300}
                      aspectRatio="aspect-auto"
                      maxWidth="max-w-full"
                      onImageUpload={(data) =>
                        handleImageUploaded(data, slotIndex)
                      }
                      containerClassName="max-w-full h-fit"
                      category="product"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 bg-gray-100 rounded">
                      <span className="text-sm text-gray-400">
                        Upload not available yet
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInformation;
