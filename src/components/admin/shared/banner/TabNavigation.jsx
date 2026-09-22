import React from "react";
import { BANNER_DEV_CONFIG } from "../constant";
import { Eye } from "lucide-react";

const TabNavigation = ({
  activeTab,
  setActiveTab,
  bannerData,
  setShowPreview,
}) => {
  const getUploadStats = () => {
    const stats = {};

    Object.keys(BANNER_DEV_CONFIG).forEach((device) => {
      const uploadedCount = Object.values(bannerData[device][0]).filter(
        (url) => url && url.length > 0
      ).length;
      stats[device] = {
        uploaded: uploadedCount,
        total: 6,
      };
    });

    return stats;
  };

  const uploadStats = getUploadStats();
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between border-b
   border-gray-200 pb-4 mb-3"
    >
      <div className="flex space-x-1 mb-4 sm:mb-0">
        {Object.keys(BANNER_DEV_CONFIG).map((device) => (
          <button
            key={device}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg
                 cursor-pointer hover:-translate-y-1 transition-all 
                 focus:outline-none duration-300 relative border border-b-0 ${
                   activeTab === device
                     ? "text-white bg-[#34C759] border-[#34C759]"
                     : "text-[#1A1A2E] bg-[#F8FCF8] border-[#E3F0E2] hover:bg-[#E3F0E2]"
                 }`}
            onClick={() => setActiveTab(device)}
          >
            {device.charAt(0).toUpperCase() + device.slice(1)}
            <span
              className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                uploadStats[device].uploaded === uploadStats[device].total
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {uploadStats[device].uploaded}/{uploadStats[device].total}
            </span>
          </button>
        ))}
      </div>

      {/* Preview button */}
      <button
        onClick={() => setShowPreview(true)}
        className="flex items-center gap-2 text-sm text-[#1A1A2E]
      cursor-pointer hover:bg-[#34C759] hover:text-white hover:border-[#34C759] px-4 py-2 rounded-lg border border-[#E3F0E2] transition-colors"
      >
        <Eye size={16} />
        <span>Preview {activeTab} banners</span>
      </button>
    </div>
  );
};

export default TabNavigation;
