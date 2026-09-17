import React, { useRef } from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
    const inputRef = useRef(null);

  const clearSearch = () => {
    onSearchChange("");
    inputRef.current?.focus();
  };
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none  
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   text-sm placeholder-gray-400 transition-all duration-200"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400
                     hover:text-gray-600 transition"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
