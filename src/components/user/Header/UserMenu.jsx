import React, { useState, useRef, useEffect } from "react";
import { UserRound, Package, MapPin, LogOut, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../pages/Auth/store/AuthStore";

const getInitials = (name) => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : `${name[0]}`.toUpperCase();
};

const MenuItem = ({ icon, label, to, onClick, className = "text-gray-700 hover:bg-gray-50" }) => {
  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${className}`}
    >
      {content}
    </button>
  );
};

export const UserMenu = ({ drawerMode = false }) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const logout = useAuthStore((s) => s.logout);
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

  const TriggerContent = () => (
    <>
      <div className="w-[42px] h-[42px] bg-[#F8FCF8] rounded-[12px] border border-[#E3F0E2] flex items-center justify-center shadow-sm shrink-0">
        {isAuthenticated && !user?.isGuest ? (
          !imageError && user?.ImageUrl ? (
            <img
              src={user.ImageUrl}
              alt={user?.FullName || "User"}
              className="w-8 h-8 rounded-full object-cover shrink-0 block"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {getInitials(user?.FullName)}
            </div>
          )
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <UserRound className="w-[20px] h-[20px] text-primary" strokeWidth={1.25} />
          </div>
        )}
      </div>
      {drawerMode && (
        <span className="text-text-main font-bold font-arial uppercase tracking-[0.5px]">
          {isAuthenticated && !user?.isGuest ? user?.FullName : "Login / Signup"}
        </span>
      )}
    </>
  );

  return (
    <div className={`relative ${drawerMode ? "w-full" : ""}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          drawerMode
            ? "flex items-center gap-3 w-full hover:text-primary transition-colors text-left"
            : "w-[42px] h-[42px] flex items-center justify-center hover:border-primary transition-colors rounded-[12px] group"
        }
      >
        <TriggerContent />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={
          drawerMode 
            ? "absolute bottom-[115%] left-0 w-full min-w-[240px] bg-white rounded-xl shadow-2xl border border-[#E3F0E2] overflow-hidden z-[60] animate-in fade-in slide-in-from-bottom-2 duration-200"
            : "absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-[#E3F0E2] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        }>
          {isAuthenticated && !user?.isGuest ? (
            <>
              {/* User Info Header */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center w-full justify-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {getInitials(user?.FullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">
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
                <div>
                  <MenuItem
                    icon={<LogOut size={18} />}
                    label="Logout"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      navigate("/signin");
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
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
