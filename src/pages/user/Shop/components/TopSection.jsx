import { X } from "lucide-react";
import SortComp from "./SortComp"; 

const TopSection = ({ filters, filterData, setFilters }) => {
  const brandMap = Object.fromEntries(
    (filterData?._brand ?? []).map(b => [b.BrandId, b.BrandName])
  );

  const categoryMap = Object.fromEntries(
    (filterData?._category ?? []).map(c => [c.CategoryId, c.CategoryName])
  );

  const activeTags = [];

  filters.brandIDs.forEach(id => {
    if (brandMap[id]) {
      activeTags.push({ type: "brand", id, label: brandMap[id] });
    }
  });

  filters.categoryIDs.forEach(id => {
    if (categoryMap[id]) {
      activeTags.push({ type: "category", id, label: categoryMap[id] });
    }
  });

if (filters.ratingFilter !== null) {
  activeTags.push({
    type: "rating",
    id: filters.ratingFilter,
    label: `${filters.ratingFilter}★ & up`,
  });
}


  const handleRemoveTag = (tag) => {
    setFilters((prev) => {
      switch (tag.type) {
        case "brand":
          return { ...prev, brandIDs: prev.brandIDs.filter(id => id !== tag.id), pageNumber: 1 };
        case "category":
          return { ...prev, categoryIDs: prev.categoryIDs.filter(id => id !== tag.id), pageNumber: 1 };
        case "rating":
          return { ...prev, ratings: prev.ratings.filter(r => r !== tag.id), pageNumber: 1 };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="px-3 pt-3 max-w-7xl mx-auto font-actor">
      <h2 className="text-black text-4xl font-medium">Fragrance</h2>

      <div className="flex justify-between items-center pt-1">
        <div className="flex gap-3 items-center">
          {/* <span className="text-sm text-[#B3B3B3]">
            Showing 1-60 of 567 items
          </span> */}

          <div className="flex gap-3 border-l-2 px-5 border-[#B3B3B3] text-sm text-[#B3B3B3]">
            {activeTags.map(tag => (
              <div
                key={`${tag.type}-${tag.id}`}
                className="p-1 flex gap-1 items-center border border-[#B3B3B3]"
              >
                <X
                  size={15}
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
                <span>{tag.label}</span>
              </div>
            ))}
          </div>
        </div>

        <SortComp 
          filters={filters}
          setFilters={setFilters}/>
      </div>
    </div>
  );
};
export default TopSection;