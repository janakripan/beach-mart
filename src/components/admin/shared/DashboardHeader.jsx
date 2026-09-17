import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Icon } from '@iconify/react';
import profilePic from "../../../assets/dashboard/profilePhoto.png";
import { HEADER_TITLE } from "./constant";
import { useAuthStore } from "../../../pages/Auth/store/AuthStore";

function DashboardHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const lastSegment = location.pathname
    .split("/")
    .pop()
    .toLowerCase()
    .replace(/[-_]/g, "");

  const title = HEADER_TITLE.filter((item) => {
    const normalizedTitle = item.title.toLowerCase().replace(/\s+/g, "");

    return (
      normalizedTitle.includes(lastSegment) ||
      lastSegment.includes(normalizedTitle)
    );
  });

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    setDropdownOpen(false);
    navigate("/adminlogin", { replace: true });
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="w-full h-fit ">
      <div className="flex flex-row justify-between items-center w-full  mx-auto p-5">
        <h1 className="font-public text-2xl font-bold capitalize text-[#23272E] ">
          {title[0]?.title}
        </h1>
        <div className="flex flex-row items-center gap-x-6  ">
          <button className="text-[#4B465C] cursor-pointer ">
            <Icon icon="tabler:bell" width="26" height="26" />
          </button>
          {/* Profile button with dropdown / logout */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-9.5 aspect-square rounded-full relative bg-black cursor-pointer"
            >
              <img
                src={profilePic}
                className="w-full h-full object-cover rounded-full"
                alt="profile picture"
              />
              <div className="w-3 aspect-square bg-[#28C76F] rounded-full border-2 border-white absolute z-10 bottom-0 right-0" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 cursor-pointer font-poppins  hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
