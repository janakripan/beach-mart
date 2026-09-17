import React, { useState } from 'react'
import CustomDropdown from "../../../../components/admin/CustomDropdown";

const SortComp = ({ filters, setFilters, position = "bottom" }) => {


const SORT_OPTIONS = [
  {
    label: "Name (A-Z)",
    sortBy: "product",
    sortType: "asc",
  },
  {
    label: "Name (Z-A)",
    sortBy: "product",
    sortType: "desc",
  },
  {
    label: "Price (Low → High)",
    sortBy: "price",
    sortType: "asc",
  },
  {
    label: "Price (High → Low)",
    sortBy: "price",
    sortType: "desc",
  },
];

const selectedOption = SORT_OPTIONS.find(
    opt =>
      opt.sortBy === filters.sortBy &&
      opt.sortType === filters.sortType
  );

  const handleChange = (option) => {
    
    setFilters(prev => ({
      ...prev,
      sortBy: option.sortBy,
      sortType: option.sortType,
      pageNumber: 1, // reset page on sort
    }));
  };

  return (
    <CustomDropdown
      options={SORT_OPTIONS}
      value={selectedOption}
      placeholder="Sort by"
      getOptionLabel={opt => opt.label}
      onChange={handleChange}
      position={position}
      buttonClassName="w-full h-[42px] px-[14px] py-[8px] gap-[8px] bg-[#F8FCF8] rounded-[12px] border border-[#E3F0E2] flex items-center justify-between hover:border-primary transition-colors shadow-sm"
      textClassName="font-marcellus text-text-main text-[14px] font-normal leading-none"
      iconClassName="w-[24px] h-[24px] text-primary"
    />
  );
};
export default SortComp
