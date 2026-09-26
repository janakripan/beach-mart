import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { PlusCircle } from "lucide-react";
import SizeModal from "../../components/admin/shared/size/sizeModal";
import { useGetVariants, useActiveVariant, useSaveVariant } from "../../api/admin/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const Variants = () => {
  const queryClient = useQueryClient();
  const { data: variants = [], isLoading, isError } = useGetVariants();
  const { mutate: activeVariantMutation } = useActiveVariant();
  const { mutate: saveVariantMutation, isPending: isSaving } = useSaveVariant();
  const [togglingIds, setTogglingIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sizeLable: "",
    isActive: true,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddSize = () => {
    setIsEditing(false);
    setCurrentSize(null);
    setFormData({ sizeLable: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Map ID if editing, otherwise pass -1 for creation
    const varientId = isEditing && currentSize ? (currentSize.ID || currentSize.VarientID || currentSize.VariantId || currentSize.VariantID || -1) : -1;
    
    saveVariantMutation(
      {
        varientId: varientId,
        varientName: formData.sizeLable,
        secondaryName: null,
        isActive: formData.isActive
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getVariants"] });
          toast.success(`Variant ${isEditing ? "updated" : "added"} successfully`);
          setIsModalOpen(false);
        },
        onError: (err) => {
          console.error("Error saving variant:", err);
          toast.error("Failed to save variant");
        }
      }
    );
  };

  const handleToggleActive = (variant) => {
    const varientId = variant.ID || variant.VarientID || variant.VariantId || variant.VariantID;
    
    if (togglingIds.includes(varientId)) return;
    
    const newStatus = !variant.IsActive;
    setTogglingIds(prev => [...prev, varientId]);
    
    activeVariantMutation(
      { varientId: varientId, varientName: variant.Name, isActive: newStatus },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getVariants"] });
          toast.success(`Variant ${newStatus ? 'activated' : 'deactivated'} successfully`);
        },
        onError: (err) => {
          console.error("Error toggling variant status:", err);
          toast.error("Failed to update variant status");
        },
        onSettled: () => {
          setTogglingIds(prev => prev.filter(id => id !== varientId));
        }
      }
    );
  };

  const filteredVariants = variants.filter((variant) =>
    variant.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditColor = (variant) => {
    setIsEditing(true);
    setCurrentSize(variant);
    setFormData({
      sizeLable: variant.Name,
      isActive: variant.IsActive,
    });
    setIsModalOpen(true);
  };

  const SIZE_TABLE_COLUMNS = [
    {
      key: "ID",
      header: "ID",
      className: "w-16",
    },
    {
      key: "Name",
      header: "Name",
      className: "w-full",
      render: (variant) => (
        <span className="bg-[#E3F0E2] text-[#00380E] px-5 text-xs font-medium py-1 rounded-full border border-primary/20">
          {variant.Name}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (variant) => {
        const varientId = variant.ID || variant.VarientID || variant.VariantId || variant.VariantID;
        const isToggling = togglingIds.includes(varientId);
        
        return (
          <div className="flex space-x-3 pl-4 items-center">
            <div
              title={variant.IsActive ? "Deactivate" : "Activate"}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActive(variant);
              }}
              className={`relative ${isToggling ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
            >
              <input type="checkbox" className="sr-only" checked={variant.IsActive} readOnly disabled={isToggling} />
              <div className={`block w-10 h-5 rounded-full transition-colors ${variant.IsActive ? "bg-primary" : "bg-gray-300"}`} />
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform flex items-center justify-center ${variant.IsActive ? "transform translate-x-5" : ""}`}>
                {isToggling && <Loader2 size={10} className="animate-spin text-primary" />}
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search variants"
        viewToggle={null}
        actionButton={{
          label: "Add Variant",
          onClick: handleAddSize,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        columns={SIZE_TABLE_COLUMNS}
        idField="ID"
        data={filteredVariants}
        emptyMessage="No variants found"
        onRowClick={(variant) => handleEditColor(variant)}
      />
      
      <SizeModal
        formData={formData}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Variants;
