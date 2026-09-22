import { Info } from "lucide-react";
import React from "react";

const DeviceInfo = ({ title, device, recommendedWidth, recommendedHeight }) => {
  return (
    <div className="bg-[#F8FCF8] border-l-4 border-[#34C759] px-4 py-3 mb-2 flex items-start">
      <Info className="text-[#34C759] w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-sm text-[#1A1A2E]">{title}</h3>
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-medium text-[#1A1A2E]">
            These images will ONLY be shown on {device} devices.
          </span>{" "}
          They will not appear on other device types.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Recommended size: {recommendedWidth} × {recommendedHeight}px
        </p>
      </div>
    </div>
  );
};

export default DeviceInfo;
