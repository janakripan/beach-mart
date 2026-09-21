// src/components/admin/MobileNavbar.jsx
import { Search, X, Menu } from "lucide-react";
import React, { useState } from "react";
import useScrollDown from "../utils/useScrollDown";
const Logo = "/Logo.png";
import { useNavbarSearch } from "../utils/useNavbarSearch";
import SidebarMenu from "./SidebarMenu";

const MobileNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrolled = useScrollDown(40);

  const {
    search,
    setSearch,
    isOpen,
    setIsOpen,
    results,
    isLoading,
    selectProduct,
  } = useNavbarSearch();

  return (
    <header className="md:hidden sticky top-0 z-50 bg-[#E4E4E4]">
      <div
        className={`flex items-center gap-2 px-3 py-2 transition-all duration-300
        ${scrolled ? "justify-center" : "justify-between"}`}
      >
        {/* LOGO */}
        <div
          className={`transition-all duration-300
          ${scrolled
            ? "-translate-y-10 opacity-0 w-0 overflow-hidden"
            : "opacity-100 w-auto"}`}
        >
          <img src={Logo} alt="Beach Circle Mini Mart Logo" className="h-8" />
        </div>

        {/* SEARCH */}
        <div className="relative flex-1">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-3">
            <Search size={18} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => search.length >= 3 && setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 150)}
              placeholder="Search products"
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
            {search.length > 0 && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()} // prevents input blur
                  onClick={() => {
                    setSearch("");
                    setIsOpen(false);
                  }}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-[#D7D7D7]
                    hover:text-white
                    transition cursor-pointer 
                  "
                >
                  <X size={20}/>                 
                </button>
              )}
          {/* RESULTS */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
              {isLoading && (
                <div className="p-3 text-sm text-gray-500">
                  Searching…
                </div>
              )}

              {!isLoading && results.length === 0 && (
                <div className="p-3 text-sm text-gray-500">
                  No products found
                </div>
              )}

              {!isLoading &&
                results.slice(0, 6).map((product) => (
                  <button
                    key={product.productId}
                    onMouseDown={() =>
                      selectProduct(product.productId)
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-100"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {product.productName}
                    </div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* HAMBURGER */}
        <div className="flex shrink-0">
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-gray-700 hover:text-black">
            <Menu size={28} />
          </button>
        </div>
      </div>
      
      <SidebarMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </header>
  );
};

export default MobileNavbar;
