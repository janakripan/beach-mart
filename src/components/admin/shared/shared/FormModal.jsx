import { X, GripVertical } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

const FormModal = ({
  isOpen,
  onClose,
  title,
  handleSubmit,
  isLoading,
  submitButtonText = "Save",
  loadingText = "Saving...",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [width, setWidth] = useState(550);
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set a small timeout to trigger the animation after the component is rendered
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleDrag = (e) => {
      if (isDragging && modalRef.current) {
        e.preventDefault();
        // Calculate new width based on screen position
        // Ensure minimum width of 450px (20rem) and maximum width of 1024px
        const newWidth = Math.max(
          550,
          Math.min(1200, window.innerWidth - e.clientX)
        );
        setWidth(newWidth);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-end z-50">
      <div
        ref={modalRef}
        style={{ width: `${width}px` }}
        className={`bg-white rounded-lg overflow-hidden h-full  max-h-[96vh] 
        flex flex-col shadow-lg p-6
        transform transition-transform duration-300 ease-in-out
        ${isVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center cursor-ew-resize hover:bg-gray-100 transition-colors"
          onMouseDown={handleDragStart}
        >
          <GripVertical size={20} className="text-gray-400" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#1A1A2E]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#1A1A2E] cursor-pointer hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-y-auto h-full pr-2"
        >
          <div className="space-y-4 h-full flex flex-col">
            <div className="h-full overflow-y-auto flex flex-col gap-y-4">
              {children}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border cursor-pointer hover:bg-[#1A1A2E] hover:text-white border-[#E3F0E2] bg-[#F8FCF8] rounded-md text-sm text-[#1A1A2E] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-primary text-white
                 ${
                   isLoading ? `cursor-not-allowed opacity-70` : `cursor-pointer hover:bg-[#2D4535]`
                 } rounded-md text-sm transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div
                      className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2
                     border-white rounded-full"
                    ></div>
                    {loadingText}
                  </span>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
