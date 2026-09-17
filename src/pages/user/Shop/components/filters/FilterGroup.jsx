import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FilterGroup = ({ title, children, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="
        relative
        py-2 px-2 md:px-5
        bg-white
        min-w-35  md:min-w-0
        snap-start
        shadow-xl border border-gray-200 rounded-xl  
      "
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
      >
        <h3 className="font-semibold text-gray-900 text-[clamp(0.8rem,1.5vw,1rem)]">
          {title}
        </h3>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Content */}
      {open && (
        <div
          className="
            
           
            bg-white  rounded-xl 
            p-3 space-y-2

            md:static md:mt-3 md:w-auto md:max-w-none
            md:p-0 md:shadow-none md:border-0 
          "
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default FilterGroup;