import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add your search logic here
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full ">
      <div className="flex items-center space-x-3">
        
        {/* Search Input Field */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg 
                       focus:outline-none "
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="text-black border border-primary hover:bg-primary  hover:text-white px-6 py-2 
                     rounded-lg font-medium transition-colors 
                     focus:outline-none  cursor-pointer"
        >
          Search
        </button>
      </div>
    </div>
  );
}
