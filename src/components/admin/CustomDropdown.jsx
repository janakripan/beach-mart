import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  getOptionLabel = (opt) => opt.label,
  position = "bottom", // 'top' or 'bottom'
  buttonClassName = "",
  textClassName = "",
  iconClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div ref={dropdownRef} className="relative w-fit  md:w-60 text-sm font-poppins">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={buttonClassName || `w-full px-4 py-2 flex items-center justify-center gap-2 bg-white 
                   border border-gray-300 rounded-lg shadow-sm 
                   hover:border-gray-400 focus:outline-none`}
      >
        <span className={textClassName || (value ? "text-gray-900" : "text-gray-500")}>
          {value ? getOptionLabel(value) : placeholder}
        </span>

        <ChevronDown
          className={`${iconClassName || "w-5 h-5 text-gray-400"} transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className={`absolute z-50 min-w-[200px] right-0 bg-white border border-gray-200 rounded-lg shadow-lg ${
          position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          {options.map((option, idx) => {
            const isSelected =
              value &&
              JSON.stringify(option) === JSON.stringify(value);

            return (
              <div
                key={idx}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-gray-100 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                {getOptionLabel(option)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
