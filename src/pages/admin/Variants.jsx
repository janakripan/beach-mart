import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import SizeModal from "../../components/admin/shared/size/sizeModal";

const initialVariants = [
  { SizeId: 1, SizeLabel: "Small", isActive: true },
  { SizeId: 2, SizeLabel: "Medium", isActive: true },
  { SizeId: 3, SizeLabel: "Large", isActive: true },
  { SizeId: 4, SizeLabel: "500g", isActive: true },
  { SizeId: 5, SizeLabel: "1KG", isActive: true },
];

const Variants = () => {
  const [variants, setVariants] = useState(initialVariants);
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
    if (isEditing && currentSize) {
      setVariants((prev) =>
        prev.map((v) =>
          v.SizeId === currentSize.SizeId
            ? { ...v, SizeLabel: formData.sizeLable, isActive: formData.isActive }
            : v
        )
      );
    } else {
      setVariants((prev) => [
        ...prev,
        {
          SizeId: Date.now(),
          SizeLabel: formData.sizeLable,
          isActive: formData.isActive,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      setVariants((prev) => prev.filter((v) => v.SizeId !== id));
    }
  };

  const filteredVariants = variants.filter((size) =>
    size.SizeLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditColor = (size) => {
    setIsEditing(true);
    setCurrentSize(size);
    setFormData({
      sizeLable: size.SizeLabel,
      isActive: size.isActive,
    });
    setIsModalOpen(true);
  };

  const SIZE_TABLE_COLUMNS = [
    {
      key: "SizeId",
      header: "ID",
      className: "w-16",
    },
    {
      key: "SizeLabel",
      header: "Name",
      className: "w-full",
      render: (size) => (
        <span className="bg-[#E3F0E2] text-[#00380E] px-5 text-xs font-medium py-1 rounded-full border border-primary/20">
          {size.SizeLabel}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (size) => (
        <div className="flex space-x-3 pl-4 items-center">
          <button
            onClick={() => handleEditColor(size)}
            className="text-gray-400 cursor-pointer hover:text-primary transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(size.SizeId)}
            className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
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
        searchPlaceholder="Search variants"
        viewToggle={null}
        actionButton={{
          label: "Add Variant",
          onClick: handleAddSize,
          icon: <PlusCircle size={16} />,
        }}
      />
      <DynamicTable
        isLoading={false}
        isError={false}
        columns={SIZE_TABLE_COLUMNS}
        idField="SizeId"
        data={filteredVariants}
        emptyMessage="No variants found"
      />
      
      <SizeModal
        formData={formData}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        isLoading={false}
      />
    </div>
  );
};

export default Variants;
