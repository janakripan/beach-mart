import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Status badge component
export const StatusBadge = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const menuRef = useRef();

  useEffect(() => {
    const handleClose = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClose);
    return () => document.removeEventListener("mousedown", handleClose);
  }, []);

  const statusStyles = {
    ordered: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    processing: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    shipped: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const statusOptions = [
    "ordered",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const style = statusStyles[currentStatus] || statusStyles.ordered;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onChange && onChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        className={`flex items-center cursor-pointer px-3 py-1 rounded-full ${style.bg} ${style.text} ${style.border} border text-sm font-medium`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="capitalize">{currentStatus}</span>
        <ChevronDown size={16} className="ml-1" />
      </div>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-40 bg-white 
        rounded-md shadow-lg border border-gray-200"
        >
          {statusOptions.map((option) => {
            const optionStyle = statusStyles[option];
            return (
              <div
                key={option}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 first:rounded-t-md last:rounded-b-md capitalize ${
                  option === currentStatus ? "bg-gray-50" : ""
                }`}
                onClick={() => handleStatusChange(option)}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${optionStyle.bg}`}
                ></span>
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
