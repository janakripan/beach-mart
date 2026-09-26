import React, { useState, Suspense } from "react";
import { Outlet } from "react-router";
import DashboardSidebar from "../../components/admin/shared/Sidebar";
import DashboardHeader from "../../components/admin/shared/DashboardHeader";
import TableSkeleton from "../../components/admin/shared/shared/TableSkeleton";


function AdminLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div data-lenis-prevent="true">
      <DashboardSidebar open={open} setOpen={setOpen} />

      <div
        id="dashboardDetails"
        className={`w-full flex flex-col bg-gray-300   h-screen transition-all duration-300 overflow-hidden ${
          open ? "pl-[280px]" : "pl-20"
        }`}
      >
        <DashboardHeader />
        <Suspense fallback={<div className="flex-1 overflow-hidden p-5"><TableSkeleton /></div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

export default AdminLayout;
