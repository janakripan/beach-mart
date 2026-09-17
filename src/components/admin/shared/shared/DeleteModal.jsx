import { X } from "lucide-react";
import React from "react";

const DeleteModal = ({
  isOpen,
  isVisible,
  setVisible,
  selected,
  handleDelete,
  title,
  isError,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        zIndex: 40,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        transition:
          "transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">{title}</h3>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 cursor-pointer hover:text-gray-600"
        >
          <X size={18} />
        </button>
      </div>

      {isError ? (
        // Show error message when there's an error
        <div className="text-sm text-red-600 mb-4">
          {error?.message ||
            "An error occurred during deletion. Please try again later."}
        </div>
      ) : (
        // Show confirmation message when no error
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete {selected.length} selected{" "}
          {selected.length === 1 ? "item" : "items"}?
        </p>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setVisible(false)}
          className="px-3 py-1.5 text-sm border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>

        {/* Only show Delete button if there's no error */}
        {!isError && (
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 text-sm cursor-pointer bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DeleteModal;
