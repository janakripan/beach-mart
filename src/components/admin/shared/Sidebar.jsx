import React from "react";
const logo = "/Logo.png";
import sidebarButton from "../../../assets/dashboard/sidebarOpen.svg";
import { NavLink } from "react-router";
import { Icon } from '@iconify/react';
import { SIDE_MENU } from "./constant";

function DashboardSidebar({ open, setOpen }) {
  return (
    <div
      className={`h-screen bg-white border-r border-gray-100 overflow-x-hidden scrollbar-hide pb-6 flex flex-col fixed left-0 top-0 transition-all duration-300 shadow-sm z-50 ${
        open ? "w-[280px]" : "w-[80px]"
      }`}
    >
      {/* logo */}
      <div
        className={`w-full h-[64px] flex flex-row items-center py-5 px-3.5 ${
          open ? "justify-between" : "justify-center"
        }`}
      >
        <div
          className={`flex flex-row items-center gap-2.5 transition-all duration-300 ${
            open ? "w-fit opacity-100" : "w-0 opacity-0"
          }`}
        >
          <img src={logo} alt="logo" className="h-10" />
          <h2
            className={`text-[#1A1A2E] font-bold text-[16px] leading-tight min-w-[130px] transition-all ${
              open ? "w-auto" : "w-0 overflow-hidden"
            }`}
          >
            Beach Circle<br/>Mini Mart
          </h2>
        </div>
        <button
          className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-gray-50 shrink-0 ${
            open ? "rotate-0" : "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        >
          <img
            src={sidebarButton}
            alt="sidebar button icon"
            className="w-4 h-4 opacity-50"
          />
        </button>
      </div>

      {/* main menu */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-6">
        {Object.keys(SIDE_MENU).map((menuHead, index) => (
          <div key={index} className="w-full h-fit flex flex-col mt-4">
            <div
              className={`w-full h-fit py-[10px] text-gray-400 font-bold uppercase tracking-wider text-xs transition-all duration-300 ${
                open ? "px-[30px]" : "px-2 text-center"
              }`}
            >
              {open ? menuHead : "..."}
            </div>
            <div className="w-full h-fit">
              <ul className={`w-full h-fit flex flex-col gap-3 px-3`}>
                {SIDE_MENU[menuHead].map((items, index) => (
                  <NavLink
                    key={index}
                    to={items.path}
                    end
                    className={({ isActive }) =>
                      `w-full transition-all duration-150 py-3 px-4 flex flex-row items-center gap-3 rounded-[12px] border ${
                        isActive
                          ? "bg-[#F8FCF8] border-primary shadow-sm text-primary"
                          : "bg-transparent border-transparent text-[#1A1A2E] hover:border-[#E3F0E2] hover:bg-[#F8FCF8] hover:shadow-sm hover:text-primary"
                      }`
                    }
                  >
                    <div className="shrink-0 text-primary">
                      <Icon icon={items.icon} width="22" height="22" />
                    </div>
                    {open && (
                      <span className="text-[16px] font-bold uppercase tracking-[0.7px] font-arial whitespace-nowrap">
                        {items.title}
                      </span>
                    )}
                  </NavLink>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardSidebar;
