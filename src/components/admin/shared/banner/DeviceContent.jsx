import React, { useEffect, useState } from "react";
import ImageUploader from "../shared/ImageUploader";
import { BANNER_DEV_CONFIG } from "../constant";

const DeviceContent = ({
  activeTab,
  bannerData,
  handleImageUpload,
  handleImageDelete,
}) => {
  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Generate 6 image uploaders for the active device type */}
        {Object.keys(bannerData).map((image, index) => (
          <div key={index} className="bg-[#F8FCF8] border border-[#E3F0E2] rounded-[12px] p-4 shadow-sm">
            <h3 className="text-sm font-medium text-[#1A1A2E] mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Banner{" "}
              {index + 1}
            </h3>
            <ImageUploader
              aspectRatio={BANNER_DEV_CONFIG[activeTab].aspectRatio}
              maxWidth={BANNER_DEV_CONFIG[activeTab].maxWidth}
              initialImage={bannerData[image]}
              buttonText={`Upload ${activeTab} Banner`}
              placeholderText={`Upload ${activeTab}-only banner ${index}`}
              minWidth={400}
              minHeight={300}
              max_Width={2000}
              maxHeight={1500}
              recommendedWidth={BANNER_DEV_CONFIG[activeTab].recommendedWidth}
              recommendedHeight={BANNER_DEV_CONFIG[activeTab].recommendedHeight}
              onImageUpload={(data) =>
                handleImageUpload(activeTab, index + 1, data)
              }
              onImageDelete={() => handleImageDelete(activeTab, index + 1)}
              containerClassName="mb-2"
            />
            <p className="text-xs text-gray-500 mt-2">
              This image will only appear on {activeTab} devices
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceContent;
