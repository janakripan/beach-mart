import React from "react";
import FormModal from "../shared/FormModal";

const SizeModal = ({
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

  return (
    <FormModal
      isLoading={isLoading}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title={isEditing ? "Edit Variant" : "Add New Variant"}
      handleSubmit={handleSubmit}
    >
      <div>
        <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
          Variant Option
        </label>
        <input
          type="text"
          name="sizeLable"
          value={formData.sizeLable}
          onChange={handleInputChange}
          className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
          placeholder="Enter variant option"
          required
        />
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
              className={`block w-10 h-5 rounded-full transition-colors ${
                formData.isActive ? "bg-primary" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${
                formData.isActive ? "transform translate-x-5" : ""
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium text-[#1A1A2E]">
            {formData.isActive ? "Active" : "Inactive"}
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          {formData.isActive
            ? "This variant will be available for use"
            : "This variant will be hidden"}
        </p>
      </div>
    </FormModal>
  );
};

export default SizeModal;
