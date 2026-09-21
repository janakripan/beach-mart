import React, { useState, useRef, useEffect } from "react";
const Logo = "/Logo.png";
import {
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  UserRound,
  Menu,
  X,
  Package,
  MapPin,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../pages/Auth/store/AuthStore";
import { useCartStore } from "../pages/Cart/store/CartStore";
import { useDebounce } from "../utils/useDebounce";
import { useProductSearch, useGetFilters } from "../api/hooks/useProduct";
import SidebarMenu from "./SidebarMenu";

const getCategoryDisplayName = (name) => {
  if (!name) return "";
  const lowerName = name.toLowerCase();
  if (lowerName === "men") return "For Him";
  if (lowerName === "women") return "For Her";
  return name;
};

const Navbar = () => {
  const { data: filterData } = useGetFilters();
  const categories = filterData?._category || [];
  
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 300);
  const { data: results = [], isLoading } = useProductSearch(debouncedSearch);

  useEffect(() => {
    setIsOpen(debouncedSearch.length >= 3);
  }, [debouncedSearch]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isSidebarOpen]);

  const cartCount = useCartStore((state) => state.items.length);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="hidden md:flex relative font-manrope bg-[#E4E4E4] w-full z-50">
      {/* ================= TOP BAR ================= */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-5 px-4 py-4">
        {/* Left */}
        <div className="flex w-full gap-5 items-center">
          <Link to="/">
            <div className="h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 shrink-0">
              <img
                src={Logo}
                alt="Beach Circle Mini Mart Logo"
                className="h-full object-contain"
              />
            </div>
          </Link>

          {/* Desktop Search + Nav */}
          <div className="hidden xl:flex flex-col gap-2 bg-white p-2 w-2/3 rounded-lg border border-[#464646]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#D7D7D7] w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Eg: Enter Product Name"
                className="w-full bg-[#282828] border border-[#8E8E93] rounded pl-10 pr-4 py-2.5 text-sm text-[#D7D7D7]"
                onFocus={() => search.length >= 2 && setIsOpen(true)}
                onBlur={() => {
                  // small delay so click can register
                  setTimeout(() => setIsOpen(false), 150);
                }}
              />
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
                  <X size={20} />
                </button>
              )}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  {isLoading && (
                    <div className="p-3 text-sm text-gray-500">Searching…</div>
                  )}

                  {!isLoading && results.length === 0 && (
                    <div className="p-3 text-sm text-gray-500">
                      No products found
                    </div>
                  )}

                  {!isLoading &&
                    results?.slice(0, 6).map((product) => (
                      <button
                        key={product.productId}
                        onMouseDown={() => {
                          navigate(`/product/${product.productId}`);
                          setSearch("");
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-left"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {product.productName}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 px-2 text-[#0D0D0D]">
              <div className="relative">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Products
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded shadow-lg py-2 min-w-[150px] z-50">
                    <Link 
                      to="/shop" 
                      onClick={() => setIsProductsOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      All Products
                    </Link>
                    {categories.map((cat) => (
                      <Link 
                        key={cat.CategoryId}
                        to={`/shop?category=${cat.CategoryId}`}
                        onClick={() => setIsProductsOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {getCategoryDisplayName(cat.CategoryName)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/help">Help</Link>
              <Link to="/contact-us">Contact Us</Link>
            </div>
          </div>
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden xl:flex items-center gap-4">
          <Link to="/wishlist" className="p-2 hover:bg-primary/10 rounded-lg">
            <Heart size={24} />
          </Link>

          <Link
            to="/cart"
            className="p-2 hover:bg-primary/10 rounded-lg relative"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <UserMenu
            isAuthenticated={isAuthenticated}
            user={user}
            logout={logout}
          />
        </div>

        {/* Hamburger Menu Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-primary/10 rounded-lg"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      <SidebarMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </nav>
  );
};

// User Menu Component
const UserMenu = ({ isAuthenticated, user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 hover:bg-primary/10 rounded-lg"
      >
        {isAuthenticated && !user?.isGuest ? (
          !imageError && user?.ImageUrl ? (
            <img
              src={user.ImageUrl}
              alt={user?.FullName || "User"}
              className="w-8 h-8 rounded-full object-cover shrink-0 block"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {getInitials(user?.FullName)}
            </div>
          )
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <UserRound size={22} />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated && !user?.isGuest ? (
            <>
              {/* User Info Header */}
              <div className="p-4 bg-linear-to-br from-blue-50 to-purple-50 ">
                <div className="flex items-center w-full justify-center  gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitials(user?.FullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 ">
                      {user?.FullName}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {user?.Email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <MenuItem
                  icon={<Package size={18} />}
                  label="My Orders"
                  to="/order-history"
                  onClick={() => setIsOpen(false)}
                />
                <MenuItem
                  icon={<MapPin size={18} />}
                  label="Addresses"
                  to="/addresses"
                  onClick={() => setIsOpen(false)}
                />
                <div className=" ">
                  <MenuItem
                    icon={<LogOut size={18} />}
                    label="Logout"
                    onClick={() => {
                      // Add your logout logic here
                      logout();
                      setIsOpen(false);
                      navigate("/");
                    }}
                    className="text-red-600 hover:bg-red-50"
                  />
                  <MenuItem
                    icon={<Package size={18} />}
                    label="Admin Login"
                    to="/adminlogin"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="py-2">
                <MenuItem
                  icon={<LogIn size={18} />}
                  label="Sign In"
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:bg-blue-50"
                />
                <MenuItem
                  icon={<UserPlus size={18} />}
                  label="Create Account"
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-600 hover:bg-blue-50"
                />
                <MenuItem
                  icon={<Package size={18} />}
                  label="Admin Login"
                  to="/adminlogin"
                  onClick={() => setIsOpen(false)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Menu Item Component
const MenuItem = ({ icon, label, to, onClick, className = "" }) => {
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${className}`}
      >
        <span className="text-gray-600">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${className}`}
    >
      <span className="text-gray-600">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default Navbar;
