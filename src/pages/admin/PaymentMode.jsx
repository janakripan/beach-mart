import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import { PlusCircle } from "lucide-react";
import { useGetPaymentModes, useSavePaymentMode } from "../../api/admin/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import EditModal from "../../components/admin/shared/shared/EditModal";
import { toast } from "sonner";

const PaymentMode = () => {
  const { data: modes = [], isLoading, isError } = useGetPaymentModes();
  const [formData, setFormData] = useState({ name: "", secondaryName: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();
  const { mutate: saveMode, isPending: isSaving } = useSavePaymentMode();
  const [togglingIds, setTogglingIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMode, setCurrentMode] = useState(null);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentMode(null);
    setFormData({ name: "", secondaryName: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mode) => {
    setIsEditing(true);
    setCurrentMode(mode);
    setFormData({
      name: mode.PaymentModeName || mode.payModeName || "",
      secondaryName: mode.SecondaryName || "",
      isActive: mode.IsActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const paymentModeId = isEditing && currentMode 
      ? (currentMode.paymodID || currentMode.PaymentModeID || currentMode.PaymentModeId || currentMode.ID || currentMode.id || currentMode.ModeID || -1) 
      : -1;
    
    // Omitting isActive ONLY when adding a new mode
    const payload = {
      paymentModeId: paymentModeId,
      paymentModeName: formData.name,
      secondaryName: formData.secondaryName || null,
    };
    if (isEditing) {
      payload.isActive = formData.isActive;
    }

    saveMode(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getPaymentModes"] });
        setFormData({ name: "", secondaryName: "", isActive: true });
        setIsModalOpen(false);
        toast.success(`Mode ${isEditing ? "updated" : "added"} successfully`);
      },
      onError: () => {
        toast.error(`Failed to ${isEditing ? "update" : "add"} mode`);
      }
    });
  };

  const handleToggle = (mode) => {
    const modeId = mode.paymodID || mode.PaymentModeID || mode.PaymentModeId || mode.ID || mode.id || mode.ModeID;
    if (togglingIds.includes(modeId)) return;
    
    setTogglingIds((prev) => [...prev, modeId]);
    saveMode(
      {
        paymentModeId: modeId,
        paymentModeName: mode.PaymentModeName || mode.payModeName,
        secondaryName: mode.SecondaryName || null,
        isActive: !mode.IsActive,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getPaymentModes"] });
        },
        onSettled: () => {
          setTogglingIds((prev) => prev.filter((id) => id !== modeId));
        },
      }
    );
  };

  const COLUMNS = [
    {
      key: "PaymentModeName",
      header: "Payment Mode",
      className: "w-1/2 font-medium text-[#1A1A2E]",
      render: (mode) => mode.PaymentModeName || mode.payModeName || mode.name || "-",
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
      render: (mode) => {
        const modeId = mode.paymodID || mode.PaymentModeID || mode.PaymentModeId || mode.ID || mode.id || mode.ModeID;
        const isToggling = togglingIds.includes(modeId);
        return (
          <div className="flex space-x-3 pl-4 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(mode);
              }}
              disabled={isToggling}
              title={mode.IsActive ? "Deactivate" : "Activate"}
              className="relative cursor-pointer flex items-center disabled:opacity-70 disabled:cursor-not-allowed border-0 bg-transparent p-0"
            >
              <input type="checkbox" className="sr-only" checked={mode.IsActive} readOnly />
              <div className={`block w-10 h-5 rounded-full transition-colors ${mode.IsActive ? "bg-primary" : "bg-gray-300"}`} />
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${mode.IsActive ? "transform translate-x-5" : ""} flex items-center justify-center`}>
                {isToggling && <Loader2 className="w-2 h-2 animate-spin text-primary" />}
              </div>
            </button>
          </div>
        );
      },
    },
  ];

  const filteredModes = modes.filter((mode) => {
    if (!searchQuery) return true;
    return mode.PaymentModeName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    mode.payModeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mode.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search payment modes"
        viewToggle={null}
        actionButton={{
          label: "Add Mode",
          onClick: handleOpenAddModal,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        columns={COLUMNS}
        idField="PaymentModeID"
        data={filteredModes}
        emptyMessage="No payment modes found"
        onRowClick={(mode) => handleOpenEditModal(mode)}
      />
      
      <EditModal
        isLoading={isSaving}
        isModalOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        titleName="Payment Mode"
        primaryLabel="Payment Mode"
        primaryName="name"
        primaryPlaceholder="Enter payment mode"
      />
    </div>
  );
};

export default PaymentMode;
