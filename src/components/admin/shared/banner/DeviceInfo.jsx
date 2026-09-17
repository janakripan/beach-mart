import { Info } from "lucide-react";
import React from "react";

const DeviceInfo = ({ title, device, recommendedWidth, recommendedHeight }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-3 mb-2 flex items-start">
      <Info className="text-yellow-500 w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-sm text-yellow-800">{title}</h3>
        <p className="text-xs text-yellow-700">
          <span className="font-medium">
            These images will ONLY be shown on {device} devices.
          </span>{" "}
          They will not appear on other device types.
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Recommended size: {recommendedWidth} × {recommendedHeight}px
        </p>
      </div>
    </div>
  );
};

export default DeviceInfo;
