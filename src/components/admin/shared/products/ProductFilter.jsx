import React, { useEffect, useRef, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { FiFilter } from "react-icons/fi";
import { TbBrandBandcamp } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { X } from "lucide-react";

const ProductFilter = ({
  searchQuery,
  categories = [],
  brands = [],
  filters = {
    category: { value: "", setValue: () => {} },
    brand: { value: "", setValue: () => {} },
    clearAll: () => {},
  },
}) => {
  // Filter visibility state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("category");

  // Search states for each filter type
  const [categorySearch, setCategorySearch] = useState("");
  const [brandSearch, setBrandSearch] = useState("");

  // Track if a filter is active
  const isFilterActive =
    filters.category.value || filters.brand.value || searchQuery.length > 0;

  // Reference for detecting clicks outside
  const filterRef = useRef(null);

  // Filter the options based on search input
  const filteredCategories =
    categories?.filter(
      (cat) =>
        cat?.Name?.toLowerCase().includes(categorySearch.toLowerCase()) ||
        cat?.Id?.toString().includes(categorySearch)
    ) || [];

  const filteredBrands =
    brands?.filter(
      (brand) =>
        brand?.Name?.toLowerCase().includes(brandSearch.toLowerCase()) ||
        brand?.Id?.toString().includes(brandSearch)
    ) || [];

  // Handle applying filters
  const handleApplyFilters = () => {
    setIsFilterOpen(false);
  };

  // Handle resetting filters
  const handleResetFilters = () => {
    filters.clearAll();
    setCategorySearch("");
    setBrandSearch("");
  };

  // Get display name for currently selected filter value
  const getSelectedCategoryName = () => {
    if (!filters.category.value) return null;
    const selected = categories?.find(
      (cat) => cat.id === filters.category.value
    );
    return selected?.name || filters.category.value;
  };

  const getSelectedBrandName = () => {
    if (!filters.brand.value) return null;
    const selected = brands?.find((brand) => brand.id === filters.brand.value);
    return selected?.name || filters.brand.value;
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative " ref={filterRef}>
      <button
        className={`flex items-center gap-2 ${
          isFilterActive ? "bg-black" : "bg-gray-100 text-gray-700"
        } ${isFilterActive ? "text-white" : ""} cursor-pointer px-4 
        rounded-lg hover:bg-[#67807d] hover:text-white transition-colors h-fit py-2`}
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <FiFilter />
        <span className="">Filter {isFilterActive && "(Active)"}</span>
      </button>

      {isFilterOpen && (
        <div
          className="absolute min-w-xl h-96  bg-white shadow-md border border-gray-200 rounded-lg
             overflow-hidden z-[1000] right-0 flex-col mt-2 flex"
        >
          <div className="w-full overflow-y-auto h-full flex">
            <div
              className=" min-w-[200px] bg-gray-50 border-r
                 border-gray-200 h-full flex flex-col gap-y-1 p-2 py-4 text-gray-800  font-sans "
            >
              <button
                className={`flex items-center gap-x-2 px-2 py-2 rounded-lg
                  ${
                    activeTab === "category"
                      ? "bg-gray-200/70"
                      : "hover:bg-gray-200/70"
                  } 
                  cursor-pointer`}
                onClick={() => setActiveTab("category")}
              >
                {" "}
                <BiCategory />
                <span className="text-[15px]">Category</span>
              </button>
              <button
                className={`flex items-center gap-x-2 px-2 py-2 rounded-lg
                  ${
                    activeTab === "brand"
                      ? "bg-gray-200/70"
                      : "hover:bg-gray-200/70"
                  } 
                  cursor-pointer`}
                onClick={() => setActiveTab("brand")}
              >
                {" "}
                <TbBrandBandcamp />
                <span className="text-[15px]">Brand</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col">
              {/* Category Filter Content */}
              {activeTab === "category" && (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full border border-gray-200 outline-none bg-gray-50 p-2 
                        text-sm pl-10 text-gray-700 rounded-lg"
                      placeholder="Search by category name or ID"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                    <IoSearch className="absolute top-3 left-3 text-gray-500" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredCategories.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredCategories.map((cat) => (
                          <div
                            key={cat.Id}
                            className={`p-2 border rounded-lg cursor-pointer
                              ${
                                filters.category.value === cat.Id
                                  ? "border-gray-500 bg-[#e8f5f3]"
                                  : "border-gray-200 hover:border-black hover:bg-[#f7fafa]"
                              }`}
                            onClick={() => filters.category.setValue(cat.Id)}
                          >
                            <div className="text-sm text-gray-700">
                              {cat.Name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {cat.Id}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No categories found
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Brand Filter Content */}
              {activeTab === "brand" && (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      className="w-full border border-gray-200 outline-none bg-gray-50 p-2 
                        text-sm pl-10 text-gray-700 rounded-lg"
                      placeholder="Search by brand name or ID"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                    />
                    <IoSearch className="absolute top-3 left-3 text-gray-500" />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredBrands.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredBrands.map((brand) => (
                          <div
                            key={brand.Id}
                            className={`p-2 border rounded-lg cursor-pointer
                              ${
                                filters.brand.value === brand.Id
                                  ? "border-black bg-[#e8f5f3]"
                                  : "border-gray-200 hover:border-black hover:bg-[#f7fafa]"
                              }`}
                            onClick={() => filters.brand.setValue(brand.Id)}
                          >
                            <div className="text-sm text-gray-700">
                              {brand.Name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {brand.Id}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No brands found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="min-h-[60px] border-t border-gray-200 flex items-center justify-end gap-x-2 px-4">
            <button
              className="text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
              onClick={handleResetFilters}
            >
              Reset All
            </button>
            <button
              className="text-sm px-3 py-2 bg-black text-white rounded-lg cursor-pointer"
              onClick={handleApplyFilters}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
