import React, { useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { X, ChevronDown, LogIn, UserPlus, Package } from "lucide-react";
import { useGetFilters } from "../api/hooks/useProduct";
const Logo = "/Logo.png";

const getCategoryDisplayName = (name) => {
  if (!name) return "";
  const lowerName = name.toLowerCase();
  if (lowerName === "men") return "For Him";
  if (lowerName === "women") return "For Her";
  return name;
};

const SidebarMenu = ({ isOpen, onClose }) => {
  const { data: filterData } = useGetFilters();
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");
  const isShopPage = location.pathname === "/shop";

  const categories = filterData?._category || [];
  const brands = filterData?._brand || [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={onClose} />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-[70] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } shadow-2xl flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <img
            src={Logo}
            alt="Beach Circle Mini Mart Logo"
            className="h-10 object-contain"
          />
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={onClose}
            className={`block py-3 px-3 mb-2 text-lg font-medium border-b border-gray-100 transition-colors ${
              location.pathname === "/"
                ? "text-black font-bold bg-gray-100 rounded-lg border-b-0"
                : "text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg"
            }`}
          >
            Home Page
          </Link>

          {/* Categories Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setOpenCategory(!openCategory)}
              className="w-full flex items-center justify-between py-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
            >
              Shop by Categories
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openCategory ? "rotate-180" : ""}`}
              />
            </button>
            {openCategory && (
              <div className="flex flex-col pl-4 pb-3 space-y-2">
                <Link
                  to="/shop"
                  onClick={onClose}
                  className={`block transition-colors ${
                    isShopPage && !currentCategory && !currentBrand
                      ? "text-black font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"
                      : "text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-1.5 rounded-lg"
                  }`}
                >
                  All Products
                </Link>
                {categories.map((cat) => {
                  const isActive = isShopPage && currentCategory === cat.CategoryId?.toString();
                  return (
                    <Link
                      key={cat.CategoryId}
                      to={`/shop?category=${cat.CategoryId}`}
                      onClick={onClose}
                      className={`block transition-colors ${
                        isActive
                          ? "text-black font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"
                          : "text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-1.5 rounded-lg"
                      }`}
                    >
                      {getCategoryDisplayName(cat.CategoryName)}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Brands Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setOpenBrand(!openBrand)}
              className="w-full flex items-center justify-between py-3 text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors"
            >
              Shop by Brands
              <ChevronDown
                className={`w-5 h-5 transition-transform ${openBrand ? "rotate-180" : ""}`}
              />
            </button>
            {openBrand && (
              <div className="flex flex-col pl-4 pb-3 space-y-2">
                {brands.map((brand) => {
                  const bId = (brand.BrandId || brand.brandId)?.toString();
                  const isActive = isShopPage && currentBrand === bId;
                  return (
                    <Link
                      key={bId}
                      to={`/shop?brand=${bId}`}
                      onClick={onClose}
                      className={`block transition-colors ${
                        isActive
                          ? "text-black font-semibold bg-gray-100 px-3 py-1.5 rounded-lg"
                          : "text-gray-600 hover:text-black hover:bg-gray-50 px-3 py-1.5 rounded-lg"
                      }`}
                    >
                      {brand.BrandName || brand.brandName}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Auth Links */}
        <div className="p-4 border-t border-gray-200 mt-auto bg-white flex flex-col space-y-3">
            <Link
              to="/signin"
              onClick={onClose}
              className="w-full flex justify-center items-center gap-2 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              <LogIn size={18} />
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="w-full flex justify-center items-center gap-2 py-3 border border-black text-black font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              <UserPlus size={18} />
              Register
            </Link>
            <Link
              to="/adminlogin"
              onClick={onClose}
              className="w-full flex justify-center items-center gap-2 py-3 border border-black text-black font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              <Package size={18} />
              Admin Login
            </Link>
          </div>
        </div>
    </>
  );
};

export default SidebarMenu;
