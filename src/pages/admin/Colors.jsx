import React, { useState } from "react";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { Edit2, PlusCircle } from "lucide-react";
import ColorModal from "../../components/admin/shared/color/ColorModal";
import { useAddColor, useEditColor, useGetColor } from "../../api/admin/hooks";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";

const Colors = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentColor, setCurrentColor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ColorName: "",
    isActive: true,
    HexCode: "",
  });
  const { data: colors, refetch, isLoading, isError } = useGetColor();
  // Mutations
  const editColor = useEditColor();
  const addColor = useAddColor();
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // Open modal for adding new color
  const handleAddColor = () => {
    setIsEditing(false);
    setCurrentColor(null);
    setFormData({ ColorName: "", isActive: true, HexCode: "" });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentColor) {
        await editColor.mutateAsync({
          updatedColor: formData,
          colorId: currentColor.ColorId,
        });
      } else {
        await addColor.mutateAsync(formData);
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const filteredColor = colors
    ? colors.filter((color) =>
        color.ColorName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Open modal for editing category
  const handleEditColor = (color) => {
    setIsEditing(true);
    setCurrentColor(color);
    setFormData({
      ColorName: color.ColorName,
      HexCode: color.HexCode,
      isActive: color.IsActive,
    });
    setIsModalOpen(true);
  };

  const COLOR_TABLE_COLUMNS = [
    {
      key: "ColorId",
      header: "ID",
      className: "w-2 text-xs text-gray",
    },
    {
      key: "HexCode",
      header: "Color",
      className: "w-5",
      render: (color) => (
        <div
          className="h-10 w-10 rounded-md border border-gray-300 shadow-sm"
          style={{ backgroundColor: color.HexCode || "#FFFFFF" }}
        />
      ),
    },
    {
      key: "ColorName",
      header: "Name",
      className: "w-full",
    },

    {
      key: "actions",
      header: "Actions",
      render: (color) => (
        <div className="flex space-x-2 pl-4">
          <button
            onClick={() => handleEditColor(color)}
            className="text-black cursor-pointer hover:text-gray-400"
          >
            <Edit2 size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full h-full overflow-hidden gap-y-4 flex flex-col p-5">
      <PageHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search here by color name"
        viewToggle={null}
        actionButton={{
          label: "Add Color",
          onClick: handleAddColor,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        isSelectable={false}
        columns={COLOR_TABLE_COLUMNS}
        idField="ColorId"
        data={filteredColor}
        emptyMessage="No colors found"
      />
      {/* Category Modal - appears at the right */}
      <ColorModal
        formData={formData}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        isLoading={addColor.isLoading || editColor.isLoading}
      />
    </div>
  );
};

export default Colors;
