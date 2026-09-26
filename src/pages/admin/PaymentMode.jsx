import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import { PlusCircle } from "lucide-react";
import { useGetPaymentModes } from "../../api/admin/hooks";

const PaymentMode = () => {
  const { data: modes = [], isLoading, isError } = useGetPaymentModes();
  const [formData, setFormData] = useState({ name: "", secondaryName: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMode = () => {
    if (!formData.name) return;
    // API integration needed for POST
    console.log("Add payment mode", formData);
    setFormData({ name: "", secondaryName: "" });
  };

  const handleToggle = (id) => {
    // API integration needed for toggle
    console.log("Toggle payment mode", id);
  };

  const COLUMNS = [
    {
      key: "PaymentModeName",
      header: "Payment Mode",
      className: "w-1/2 font-medium text-[#1A1A2E]",
      render: (mode) => mode.PaymentModeName || mode.name || "-",
    },
    {
      key: "SecondaryName",
      header: "Secondary Name",
      className: "w-1/3 text-gray-500",
      render: (mode) => mode.SecondaryName || "-",
    },
    {
      key: "IsActive",
      header: "Status",
      className: "w-32",
      render: (mode) => (
        <div onClick={() => handleToggle(mode.PaymentModeID || mode.id)} className="relative cursor-pointer flex items-center">
          <input type="checkbox" className="sr-only" checked={mode.IsActive} readOnly />
          <div className={`block w-10 h-5 rounded-full transition-colors ${mode.IsActive ? "bg-primary" : "bg-gray-300"}`} />
          <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${mode.IsActive ? "transform translate-x-5" : ""}`} />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full overflow-hidden gap-y-6 flex flex-col p-5 bg-[#F8FCF8]">
      {/* Top Section */}
      <div className="flex items-end gap-4 w-full bg-white p-5 rounded-[12px] border border-[#E3F0E2]">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#1A1A2E] mb-2">Payment Mode</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-[#E3F0E2] bg-[#F8FCF8] rounded-[12px] p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            placeholder="Enter new payment mode"
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
          onClick={handleAddMode}
          className="flex items-center gap-2 bg-primary text-white h-[46px] px-6 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle size={18} />
          Add Mode
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-y-auto">
        <DynamicTable
          isLoading={isLoading}
          isError={isError}
          columns={COLUMNS}
          idField="PaymentModeID"
          data={modes}
          emptyMessage="No payment modes added yet"
        />
      </div>
    </div>
  );
};

export default PaymentMode;
