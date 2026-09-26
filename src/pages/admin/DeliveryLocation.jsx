import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import { PlusCircle } from "lucide-react";
import { useGetDeliveryLocations, useSaveDeliveryLocation } from "../../api/admin/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import EditModal from "../../components/admin/shared/shared/EditModal";
import { toast } from "sonner";

const DeliveryLocation = () => {
  const { data: locations = [], isLoading, isError } = useGetDeliveryLocations();
  const [formData, setFormData] = useState({ name: "", secondaryName: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();
  const { mutate: saveLocation, isPending: isSaving } = useSaveDeliveryLocation();
  const [togglingIds, setTogglingIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLoc, setCurrentLoc] = useState(null);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentLoc(null);
    setFormData({ name: "", secondaryName: "", isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (loc) => {
    setIsEditing(true);
    setCurrentLoc(loc);
    setFormData({
      name: loc.LocationName,
      secondaryName: loc.SecondaryName || "",
      isActive: loc.IsActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const locationId = isEditing && currentLoc ? currentLoc.LocationID : -1;
    
    // Omitting isActive ONLY when adding a new location as per backend requirements
    const payload = {
      locationId: locationId,
      locationName: formData.name,
      secondaryName: formData.secondaryName || null,
    };
    if (isEditing) {
      payload.isActive = formData.isActive;
    }

    saveLocation(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getDeliveryLocations"] });
        setFormData({ name: "", secondaryName: "", isActive: true });
        setIsModalOpen(false);
        toast.success(`Location ${isEditing ? "updated" : "added"} successfully`);
      },
      onError: () => {
        toast.error(`Failed to ${isEditing ? "update" : "add"} location`);
      }
    });
  };

  const handleToggle = (loc) => {
    if (togglingIds.includes(loc.LocationID)) return;
    
    setTogglingIds((prev) => [...prev, loc.LocationID]);
    saveLocation(
      {
        locationId: loc.LocationID,
        locationName: loc.LocationName,
        secondaryName: loc.SecondaryName || null,
        isActive: !loc.IsActive,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getDeliveryLocations"] });
        },
        onSettled: () => {
          setTogglingIds((prev) => prev.filter((id) => id !== loc.LocationID));
        },
      }
    );
  };

  const COLUMNS = [
    {
      key: "LocationName",
      header: "Location Name",
      className: "w-1/2 font-medium text-[#1A1A2E]",
      render: (loc) => loc.LocationName,
    },
    {
      key: "SecondaryName",
      header: "Secondary Name",
      className: "w-1/3 text-gray-500",
      render: (loc) => loc.SecondaryName || "-",
    },
    {
      key: "IsActive",
      header: "Status",
      className: "w-32",
      render: (loc) => {
        const isToggling = togglingIds.includes(loc.LocationID);
        return (
          <div className="flex space-x-3 pl-4 items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(loc);
              }}
              disabled={isToggling}
              title={loc.IsActive ? "Deactivate" : "Activate"}
              className="relative cursor-pointer flex items-center disabled:opacity-70 disabled:cursor-not-allowed border-0 bg-transparent p-0"
            >
              <input type="checkbox" className="sr-only" checked={loc.IsActive} readOnly />
              <div className={`block w-10 h-5 rounded-full transition-colors ${loc.IsActive ? "bg-primary" : "bg-gray-300"}`} />
              <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${loc.IsActive ? "transform translate-x-5" : ""} flex items-center justify-center`}>
                {isToggling && <Loader2 className="w-2 h-2 animate-spin text-primary" />}
              </div>
            </button>
          </div>
        );
      },
    },
  ];

  const filteredLocations = locations.filter((loc) => {
    if (!searchQuery) return true;
    return loc.LocationName?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search delivery locations"
        viewToggle={null}
        actionButton={{
          label: "Add Location",
          onClick: handleOpenAddModal,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        columns={COLUMNS}
        idField="LocationID"
        data={filteredLocations}
        emptyMessage="No delivery locations found"
        onRowClick={(loc) => handleOpenEditModal(loc)}
      />
      
      <EditModal
        isLoading={isSaving}
        isModalOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        titleName="Delivery Location"
        primaryLabel="Location Name"
        primaryName="name"
        primaryPlaceholder="Enter delivery location"
      />
    </div>
  );
};

export default DeliveryLocation;
