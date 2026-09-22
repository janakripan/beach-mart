import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import { PlusCircle } from "lucide-react";

const DeliveryLocation = () => {
  const [locations, setLocations] = useState([
    { id: 1, name: "Dubai", isActive: true },
    { id: 2, name: "Abu Dhabi", isActive: true },
    { id: 3, name: "Sharjah", isActive: false },
  ]);
  const [formData, setFormData] = useState({ name: "", secondaryName: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLocation = () => {
    if (!formData.name) return;
    setLocations((prev) => [
      { id: Date.now(), name: formData.name, isActive: true },
      ...prev,
    ]);
    setFormData({ name: "", secondaryName: "" });
  };

  const handleToggle = (id) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, isActive: !loc.isActive } : loc))
    );
  };

  const COLUMNS = [
    {
      key: "name",
      header: "Location Name",
      className: "w-full font-medium text-[#1A1A2E]",
      render: (loc) => loc.name,
    },
    {
      key: "isActive",
      header: "Status",
      className: "w-32",
      render: (loc) => (
        <div onClick={() => handleToggle(loc.id)} className="relative cursor-pointer flex items-center">
          <input type="checkbox" className="sr-only" checked={loc.isActive} readOnly />
          <div className={`block w-10 h-5 rounded-full transition-colors ${loc.isActive ? "bg-primary" : "bg-gray-300"}`} />
          <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${loc.isActive ? "transform translate-x-5" : ""}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-hidden gap-y-6 flex flex-col p-5 bg-[#F8FCF8]">
      {/* Top Section */}
      <div className="flex items-end gap-4 w-full bg-white p-5 rounded-[12px] border border-[#E3F0E2]">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Location Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#E3F0E2] bg-[#F8FCF8] rounded-[12px] p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter new delivery location"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Secondary Name</label>
          <input
            type="text"
            name="secondaryName"
            value={formData.secondaryName}
            onChange={handleInputChange}
            className="w-full border border-[#E3F0E2] bg-[#F8FCF8] rounded-[12px] p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter secondary name (optional)"
          />
        </div>
        <button
          onClick={handleAddLocation}
          className="flex items-center gap-2 bg-primary text-white h-[46px] px-6 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle size={18} />
          Add Location
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-y-auto">
        <DynamicTable
          isLoading={false}
          isError={false}
          columns={COLUMNS}
          idField="id"
          data={locations}
          emptyMessage="No delivery locations added yet"
        />
      </div>
    </div>
  );
};

export default DeliveryLocation;
