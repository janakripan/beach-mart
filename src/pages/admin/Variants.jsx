import React, { useState } from "react";
import DynamicTable from "../../components/admin/shared/shared/DynamicTable";
import PageHeader from "../../components/admin/shared/shared/PageHeader";
import ConfirmModal from "../../components/admin/shared/shared/ConfirmModal";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import SizeModal from "../../components/admin/shared/size/sizeModal";
import { useGetVariants } from "../../api/admin/hooks";

const Variants = () => {
  const { data: variants = [], isLoading, isError } = useGetVariants();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSize, setCurrentSize] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
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
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = () => {
    if (deleteModal.id) {
      setVariants((prev) => prev.filter((v) => v.VariantId !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: null });
    }
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
      render: (variant) => (
        <div className="flex space-x-3 pl-4 items-center">
          <button
            onClick={() => handleEditColor(variant)}
            className="text-gray-400 cursor-pointer hover:text-primary transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(variant.ID)}
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
        isLoading={isLoading}
        isError={isError}
        columns={SIZE_TABLE_COLUMNS}
        idField="ID"
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Variant"
        message="Are you sure you want to delete this variant? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </div>
  );
};

export default Variants;
