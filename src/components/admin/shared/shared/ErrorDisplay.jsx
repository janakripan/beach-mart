import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorDisplay = ({
  message = "Something went wrong",
  description = "We encountered an error while processing your request.",
  onRetry = null,
  icon = <AlertCircle size={32} className="text-red-500" />,
  className = "",
}) => {
  return (
    <div
      className={`w-full overflow-hidden bg-white rounded-lg shadow
         border border-gray-200 ${className}`}
    >
      <div className="flex flex-col items-center justify-center p-8 text-center h-64">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
        <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-black/80 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
