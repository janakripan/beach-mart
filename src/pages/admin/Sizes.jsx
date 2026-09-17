import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { Edit2, PlusCircle } from "lucide-react";
import { useAddSize, useEditSize, useGetSizes } from "../../api/admin/hooks";
import SizeModal from "../../components/admin/shared/size/sizeModal";

const Sizes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    sizeLable: "",
    isActive: true,
  });
  const { data: sizes, refetch, isLoading, isError } = useGetSizes();
  // Mutations
  const editSize = useEditSize();
  const addSize = useAddSize();
  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  // Open modal for adding new color
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
  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && currentSize) {
        await editSize.mutateAsync({
          updatedSize: formData,
          sizeId: currentSize.SizeId,
        });
      } else {
        await addSize.mutateAsync(formData);
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const filteredColor = sizes
    ? sizes.filter((size) =>
        size.SizeLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Open modal for editing category
  const handleEditColor = (size) => {
    setIsEditing(true);
    setCurrentSize(size);
    setFormData({
      sizeLable: size.SizeLabel,
      isActive: size.IsActive,
    });
    setIsModalOpen(true);
  };

  const SIZE_TABLE_COLUMNS = [
    {
      key: "SizeId",
      header: "ID",
      className: "w-4",
    },
    {
      key: "SizeLabel",
      header: "Name",
      className: "w-full",
      render: (size) => (
        <span className="bg-gray-100 text-gray-500 px-5 text-xs font-medium  py-1 rounded-full">
          {size.SizeLabel}
        </span>
      ),
    },

    {
      key: "actions",
      header: "Actions",
      render: (size) => (
        <div className="flex space-x-2 pl-4">
          <button
            onClick={() => handleEditColor(size)}
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
        searchPlaceholder="Search here by size lable"
        viewToggle={null}
        actionButton={{
          label: "Add Size",
          onClick: handleAddSize,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={isLoading}
        isError={isError}
        columns={SIZE_TABLE_COLUMNS}
        idField="SizeId"
        data={filteredColor}
        emptyMessage="No size found"
      />
      {/* Size Modal - appears at the right */}
      <SizeModal
        formData={formData}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        isLoading={addSize.isLoading || editSize.isLoading}
      />
    </div>
  );
};

export default Sizes;
