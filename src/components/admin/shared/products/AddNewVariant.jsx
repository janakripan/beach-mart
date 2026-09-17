import { CheckCircle, PlusCircle } from "lucide-react";
import React from "react";
import ImageUploader from "../shared/ImageUploader";

const AddNewVariant = ({
  currentVariant,
  handleVariantChange,
  setCurrentVariant,
  addNewVariantFormRef,
  addVariant,
  sizes,
  colors,
  editingVariantIndex,
  variantsListRef,
  addVarinatIndex,
  onCancel,
}) => {
  console.log(currentVariant)
  // Handle image upload for a specific slot
  const handleImageUploadedForSlot = (data, slotIndex) => {
    if (data && data.FileDetails) {
      const newImageUrl = data.FileDetails[0].FileUrl;

      setCurrentVariant((prev) => {
        // Create a copy of current images, ensuring it has enough slots
        let currentImages = [...(prev.images || [])];

        // Ensure the array has enough slots by filling with null values if needed
        while (currentImages.length <= slotIndex) {
          currentImages.push(null);
        }

        // Set the image at the specific slot index
        currentImages[slotIndex] = {
          imageUrl: newImageUrl,
          isPrimary: currentImages.every(
            (img) => img === null || !img?.isPrimary
          ),
        };

        // Filter out null values for the final images array
        const filteredImages = currentImages.filter((img) => img !== null);

        return {
          ...prev,
          images: filteredImages,
        };
      });
    }
  };

  // Set image as primary
  const setImageAsPrimary = (index) => {
    setCurrentVariant((prev) => {
      const updatedImages = prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }));
      return { ...prev, images: updatedImages };
    });
  };

  // Remove an image
  const removeImage = (index) => {
    setCurrentVariant((prev) => {
      // Create a copy of the images array
      const currentImages = [...prev.images];

      // Get the image being removed
      const removedImage = currentImages[index];

      // Create a new array without the removed image but preserving slots
      const newImages = currentImages.map((img, i) =>
        i === index ? null : img
      );

      // Filter out null values for the final array
      const filteredImages = newImages.filter((img) => img !== null);

      // If we removed the primary image, set the first remaining image as primary
      if (removedImage && removedImage.isPrimary && filteredImages.length > 0) {
        filteredImages[0].isPrimary = true;
      }

      return { ...prev, images: filteredImages };
    });
  };

  // Get image URL for a specific slot if it exists
  const getImageUrlForSlot = (slotIndex) => {
    if (!currentVariant.images) return "";

    // Find the image that corresponds to this slot
    const imageForSlot = currentVariant.images.find((img, i) => {
      // We need to map the actual image index to the visible slot index
      // Since images array might not have null values anymore after filtering
      return i === slotIndex;
    });

    return imageForSlot?.imageUrl || "";
  };

  // Check if an image is primary
  const isImagePrimary = (slotIndex) => {
    if (!currentVariant.images) {
      return slotIndex === 0; // Default first slot is primary
    }

    // Find the image that corresponds to this slot
    const imageForSlot = currentVariant.images.find(
      (img, i) => i === slotIndex
    );
    return imageForSlot?.isPrimary || false;
  };

  // Handle the add variant button click
  const handleAddVariant = () => {
    // First add the variant
    addVariant();

    // Then scroll to the variants list section
    if (variantsListRef && variantsListRef.current) {
      // Add a small delay to ensure the variants list is updated
      setTimeout(() => {
        variantsListRef?.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };
  // Determine the next available slot for image upload
  const getNextAvailableSlot = () => {
    if (!currentVariant.images) return 0;

    // Find the first empty slot
    for (let i = 0; i < 4; i++) {
      const hasImage = currentVariant.images.some(
        (img, index) => index === i && img?.imageUrl
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
    <div
      ref={addNewVariantFormRef}
      className="border border-gray-200 rounded-md p-4 bg-gray-50"
    >
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Add New Variant
      </h4>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <select
            name="colorId"
            value={currentVariant?.colorId}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Select Color</option>
            {colors &&
              colors.map((color) => (
                <option key={color.ColorId} value={color.ColorId}>
                  {color.ColorName}
                </option>
              ))}
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          <select
            name="sizeId"
            value={currentVariant.sizeId || ""}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="">Select Size</option>
            {sizes &&
              sizes.map((size) => (
                <option key={size.SizeId} value={size.SizeId}>
                  {size.SizeLabel}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SKU
        </label>
        <input
          type="text"
          name="sku"
          value={currentVariant?.sku || ""}
          onChange={handleVariantChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter SKU code"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price.price"
            value={currentVariant?.price?.price || ""}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <input
            type="number"
            name="stock.onhand"
            value={currentVariant?.stock?.onhand || ""}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount %
          </label>
          <input
            type="number"
            name="price.discountPercentage"
            value={currentVariant?.price?.discountPercentage || ""}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Discount Price
          </label>
          <input
            type="number"
            name="price.discountPrice"
            value={currentVariant?.price?.discountPrice || ""}
            onChange={handleVariantChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Variant Images */}
      <div className="w-full mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variant Images (Up to 4)
        </label>

        {/* 2x2 Grid for 4 image upload slots */}
        <div className="grid grid-cols-2 gap-2">
          {/* Generate 4 image upload slots */}
          {[0, 1, 2, 3].map((slotIndex) => (
            <div
              key={slotIndex}
              className={`relative border rounded-md p-2 ${
                !getImageUrlForSlot(slotIndex) && !isSlotAvailable(slotIndex)
                  ? "border-gray-200 bg-gray-100 opacity-60"
                  : "border-gray-300"
              }`}
            >
              <div className="mb-2 flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Image {slotIndex + 1}
                  {!getImageUrlForSlot(slotIndex) &&
                    !isSlotAvailable(slotIndex) &&
                    " (Upload previous images first)"}
                </span>
                {getImageUrlForSlot(slotIndex) && (
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setImageAsPrimary(slotIndex)}
                      disabled={isImagePrimary(slotIndex)}
                      className={`text-xs px-2 py-1 rounded ${
                        isImagePrimary(slotIndex)
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 hover:bg-green-500 hover:text-white"
                      }`}
                    >
                      {isImagePrimary(slotIndex) ? "Primary" : "Set Primary"}
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
                  aspectRatio="aspect-auto"
                  maxWidth="max-w-full"
                  onImageUpload={(data) =>
                    handleImageUploadedForSlot(data, slotIndex)
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

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1 bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAddVariant}
          className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
        >
          {addVarinatIndex !== null ? (
            <>
              <CheckCircle size={16} />
              Update Variant
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              Add Variant
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddNewVariant;
