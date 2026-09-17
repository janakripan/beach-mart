import React from "react";
import FormModal from "../shared/FormModal";
import ImageUploader from "../shared/ImageUploader";

const ColorModal = ({
  isLoading,
  isModalOpen,
  handleCloseModal,
  isEditing,
  handleSubmit,
  formData,
  handleInputChange,
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

  // Handle color picker change
  const handleColorChange = (e) => {
    handleInputChange({
      target: {
        name: "HexCode",
        value: e.target.value,
      },
    });
  };

  // Handle color code input change
  const handleColorCodeChange = (e) => {
    // Format the input value to ensure it starts with #
    let value = e.target.value;
    if (value && !value.startsWith("#")) {
      value = "#" + value;
    }

    handleInputChange({
      target: {
        name: "HexCode",
        value: value,
      },
    });
  };

  return (
    <FormModal
      isLoading={isLoading}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={isEditing ? "Edit Color" : "Add New Color"}
      handleSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Name
        </label>
        <input
          type="text"
          name="ColorName"
          value={formData.ColorName}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Enter brand name"
          required
        />
      </div>

      {/* Color Picker Field */}
      <div className="">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color
        </label>
        <div className="flex items-center space-x-3">
          <div
            className="h-10 w-10 rounded-md border border-gray-300 shadow-sm"
            style={{ backgroundColor: formData.color || "#FFFFFF" }}
          />
          <input
            type="color"
            name="HexCode"
            value={formData.HexCode || "#FFFFFF"}
            onChange={handleColorChange}
            className="h-10 w-16 rounded-md border border-gray-300 p-1 cursor-pointer"
          />
          <input
            type="text"
            name="HexCode"
            value={formData.HexCode || "#FFFFFF"}
            onChange={handleColorCodeChange}
            placeholder="#FFFFFF"
            className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select a color or enter a hex color code (e.g., #005C53)
        </p>
      </div>

      {/* Toggle button for active status */}
      <div className="mt-4">
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
                formData.isActive ? "bg-black" : "bg-gray-300"
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

export default ColorModal;
