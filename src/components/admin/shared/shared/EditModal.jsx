import React from "react";
import FormModal from "./FormModal";

const EditModal = ({
  isLoading,
  isModalOpen,
  handleCloseModal,
  isEditing,
  handleSubmit,
  formData,
  handleInputChange,
  titleName,
  primaryLabel,
  primaryName,
  primaryPlaceholder,
  secondaryLabel = "Secondary Name",
  secondaryName = "secondaryName",
  secondaryPlaceholder = "Enter secondary name",
  showSecondary = true,
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
      title={isEditing ? `Edit ${titleName}` : `Add New ${titleName}`}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
            {primaryLabel}
          </label>
          <input
            type="text"
            name={primaryName}
            value={formData[primaryName] || ""}
            onChange={handleInputChange}
            className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
            placeholder={primaryPlaceholder}
            required
          />
        </div>

        {showSecondary && (
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
              {secondaryLabel}
            </label>
            <input
              type="text"
              name={secondaryName}
              value={formData[secondaryName] || ""}
              onChange={handleInputChange}
              className="w-full border-2 border-[#E3F0E2] rounded-md p-2.5 text-sm focus:border-primary focus:outline-none"
              placeholder={secondaryPlaceholder}
            />
          </div>
        )}

        {/* Toggle button for active status */}
        <div className="mt-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isActive ?? true}
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
            <span className="text-sm font-medium text-gray-700">
              {formData.isActive ? "Active" : "Inactive"}
            </span>
          </label>
        </div>
      </div>
    </FormModal>
  );
};

export default EditModal;
