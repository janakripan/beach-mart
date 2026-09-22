import { PlusCircle, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";

/**
 * A reusable header component for pages with search and action buttons
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.searchPlaceholder - Placeholder text for search input
 * @param {Object} props.viewToggle - Configuration for view toggle button (optional)
 * @param {boolean} props.viewToggle.isGridView - Current view state
 * @param {Function} props.viewToggle.setViewMode - Function to toggle view
 * @param {React.ReactNode} props.viewToggle.gridIcon - Icon for grid view
 * @param {React.ReactNode} props.viewToggle.alternateIcon - Icon for alternate view
 * @param {Object} props.actionButton - Configuration for primary action button (optional)
 * @param {string} props.actionButton.label - Button label text
 * @param {Function} props.actionButton.onClick - Button click handler
 * @param {React.ReactNode} props.actionButton.icon - Button icon
 * @param {string} props.actionButton.className - Additional classes for action button
 * @param {React.ReactNode} props.children - Additional content for the header
 */
const PageHeader = ({
  searchQuery = "",
  setSearchQuery = () => {},
  searchPlaceholder = "Search...",
  viewToggle = true,
  actionButton,
  children,
}) => {
  // State for tooltip visibility
  const [showTooltip, setShowTooltip] = useState(false);

  // Use localStorage to track if tooltip has been shown before
  useEffect(() => {
    // Check if tooltip has been shown before
    const hasSeenTooltip = localStorage.getItem("hasSeenGridTooltip");

    if (!hasSeenTooltip) {
      // If not shown before, show it and set the flag
      setShowTooltip(true);
      localStorage.setItem("hasSeenGridTooltip", "true");
    }
  }, []);

  // Default button styling
  const defaultButtonClass =
    "flex items-center gap-2 bg-primary  text-white cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-primary/90  hover:shadow-lg hover:scale-105";

  // Function to close tooltip
  const closeTooltip = (e) => {
    e.stopPropagation();
    setShowTooltip(false);
  };

  // Function to reset search query
  const handleResetSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      <div 
        className="max-w-[400px] relative w-full h-[46px] bg-[#F8FCF8] rounded-[12px] border border-[#0F1E361A] focus-within:border-primary transition-colors flex items-center"
        style={{ boxShadow: 'inset 0px 2px 4px 1px #00000005' }}
      >
        <IoSearch
          className="absolute text-[#57E77B] top-0 bottom-0 my-auto text-lg left-4"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-full bg-transparent outline-none rounded-lg text-[#1A1A2E] text-[16px] placeholder:text-[#757575] font-arial pl-12 pr-10"
          placeholder={searchPlaceholder}
        />

        {/* Reset search button - only visible when searchQuery has content */}
        {searchQuery && (
          <button
            onClick={handleResetSearch}
            className="absolute right-3 top-0 bottom-0 my-auto p-1 text-gray-400 transition-all duration-200 ease-in-out hover:text-gray-600 hover:scale-110"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-x-3 justify-end">
        {/* View toggle button with tooltip */}
        {viewToggle && (
          <div className="relative">
            <button
              onClick={() => viewToggle.setViewMode((prev) => !prev)}
              className="group cursor-pointer p-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-100 hover:scale-110"
            >
              {viewToggle.isGridView
                ? viewToggle.gridIcon
                : viewToggle.alternateIcon}
            </button>

            {/* Professional tooltip with close button - only shows first time */}
            {showTooltip && (
              <div
                className="absolute right-0 top-12 w-64
               bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] p-3 text-sm"
              >
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"></div>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-800">Layout tip</div>
                  <button
                    onClick={closeTooltip}
                    className="text-gray-500 transition-colors duration-200 ease-in-out hover:text-gray-700 hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-gray-600">
                  You can rearrange items by drag and drop to customize your
                  view
                </p>
              </div>
            )}
          </div>
        )}

        {/* Optional action button */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className={actionButton.className || defaultButtonClass}
          >
            {actionButton.icon}
            <span>{actionButton.label}</span>
          </button>
        )}

        {/* Additional content */}
        {children}
      </div>
    </div>
  );
};

export default PageHeader;
