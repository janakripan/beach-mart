import React, { useState, useEffect } from "react";
import DeviceContent from "../../components/admin/shared/banner/DeviceContent";
import DeviceInfo from "../../components/admin/shared/banner/DeviceInfo";
import { DevicePreview } from "../../components/admin/shared/banner/DevicePreview";
import TabNavigation from '../../components/admin/shared/banner/TabNavigation'
import { BANNER_DEV_CONFIG, BANNER_INITIAL_VALUE } from "../../components/admin/shared/constant";

const BannerManagement = () => {
  const [activeTab, setActiveTab] = useState("desktop");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [showPreview, setShowPreview] = useState(false);
  const [localBannerData, setLocalBannerData] = useState(JSON.parse(JSON.stringify(BANNER_INITIAL_VALUE)));
  const [updateTrigger, setUpdateTrigger] = useState(0); 

  const isLoading = false;
  const currentBannerData = localBannerData;

  // Function to handle image upload for specific device type
  const handleImageUpload = async (device, imageIndex, data) => {
    try {
      if (!currentBannerData) return;

      // Update local state
      const newData = JSON.parse(JSON.stringify(currentBannerData)); // Deep copy
      newData[device][0][`imgurl_${imageIndex}`] = data.FileDetails[0].FileUrl;

      // Update local state immediately
      setLocalBannerData(newData);
      setUpdateTrigger((prev) => prev + 1); // Force re-render

      // Simulate backend save delay
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      setSaveMessage({
        type: "success",
        text: `Image ${imageIndex} for ${device} uploaded and saved successfully`,
      });
    } catch (error) {
      console.error("Failed to save uploaded image:", error);
      setSaveMessage({
        type: "error",
        text: `Failed to save image ${imageIndex} for ${device}`,
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  // Function to handle image deletion for specific device type
  const handleImageDelete = async (device, imageIndex) => {
    try {
      if (!currentBannerData) return;

      // Update local state
      const newData = JSON.parse(JSON.stringify(currentBannerData)); // Deep copy
      newData[device][0][`imgurl_${imageIndex}`] = "";

      // Update local state immediately
      setLocalBannerData(newData);
      setUpdateTrigger((prev) => prev + 1); // Force re-render

      // Simulate backend save delay
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      setSaveMessage({
        type: "success",
        text: `Image ${imageIndex} for ${device} removed and saved successfully`,
      });
    } catch (error) {
      console.error("Failed to save image removal:", error);
      setSaveMessage({
        type: "error",
        text: `Failed to remove image ${imageIndex} for ${device}`,
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  // Save banner order arrangement
  const handleOrderArrangement = async (orderedData, deviceType) => {
    try {
      if (!currentBannerData) return;

      // Create a deep copy of the current data
      const newData = JSON.parse(JSON.stringify(currentBannerData));

      // Update the specific device's data with the ordered data
      newData[deviceType][0] = orderedData;

      // Update local state immediately
      setLocalBannerData(newData);
      setUpdateTrigger((prev) => prev + 1); // Force re-render

      // Simulate backend save delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Show success message
      setSaveMessage({
        type: "success",
        text: `Banner order for ${deviceType} saved successfully`,
      });

      return true; // Indicate success
    } catch (error) {
      console.error("Failed to save banner order:", error);
      setSaveMessage({
        type: "error",
        text: `Failed to save banner order for ${deviceType}`,
      });
      return false; // Indicate failure
    } finally {
      setTimeout(() => setSaveMessage({ type: "", text: "" }), 3000);
    }
  };

  if (isLoading && !localBannerData) {
    return <ShimmerLoading />;
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col px-5 py-3 bg-[#F8FCF8]">
      <div className="bg-white rounded-[12px] border border-[#E3F0E2] overflow-y-auto flex flex-col h-full shadow-sm p-4">
        {/* Status message */}
        {saveMessage.text && (
          <div
            className={`mb-4 z-50 absolute bottom-0 right-5 p-3 rounded-md ${
              saveMessage.type === "success"
                ? "bg-green-50 text-green-800 border-l-4 border-green-500"
                : "bg-red-50 text-red-800 border-l-4 border-red-500"
            }`}
          >
            {saveMessage.text}
          </div>
        )}

        {/* Tab Navigation with upload stats */}
        {currentBannerData && (
          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bannerData={currentBannerData}
            setShowPreview={setShowPreview}
          />
        )}

        {/* Active device info banner */}
        {currentBannerData && (
          <DeviceInfo
            title={BANNER_DEV_CONFIG[activeTab].title}
            device={activeTab}
            recommendedWidth={BANNER_DEV_CONFIG[activeTab].recommendedWidth}
            recommendedHeight={BANNER_DEV_CONFIG[activeTab].recommendedHeight}
          />
        )}

        {/* Content for active device type */}
        {currentBannerData && (
          <DeviceContent
            activeTab={activeTab}
            bannerData={currentBannerData[activeTab][0]}
            handleImageDelete={handleImageDelete}
            handleImageUpload={handleImageUpload}
            key={`content-${activeTab}-${updateTrigger}`} // Force re-render with key
          />
        )}
      </div>

      {/* Preview modal */}
      {showPreview && currentBannerData && (
        <DevicePreview
          handleOrderArrangement={handleOrderArrangement}
          deviceType={activeTab}
          bannerImages={currentBannerData[activeTab][0]}
          setShowPreview={setShowPreview}
          key={`preview-${updateTrigger}`} // Force re-render with key
        />
      )}
    </div>
  );
};

export default BannerManagement;

// Shimmer loading component
const ShimmerLoading = () => {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col px-5 py-3">
      <div className="bg-white rounded-xl overflow-y-auto flex flex-col h-full shadow-md p-4">
        {/* Tab Navigation shimmer */}
        <div className="flex border-b pb-3 border-gray-200 mb-4">
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded mr-4"></div>
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded mr-4"></div>
          <div className="w-24 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Device info shimmer */}
        <div className="mb-4">
          <div className="w-64 h-8 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="w-full h-12 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Content shimmer */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="aspect-video bg-gray-200 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
