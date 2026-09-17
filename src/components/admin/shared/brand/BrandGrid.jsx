import React, { useState, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2 } from "lucide-react";
import { useEditBrandOrder } from "../../../../api/admin/hooks";

// Sortable Brand Card Component
const SortableCategoryCard = ({ brand, handleEditBrand }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: brand.Id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col 
        ${isDragging ? "ring-2 ring-blue-500" : ""}`}
    >
      <div
        className="h-42 bg-gray-200 relative cursor-grab"
        style={{
          backgroundImage: brand.ImageUrl ? `url(${brand.ImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        {...attributes}
        {...listeners}
      >
        {!brand.ImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
          {brand.Name}
        </h3>

        <button
          title="Edit"
          onClick={() => handleEditBrand(brand)}
          className="mt-2 text-sm cursor-pointer group text-blue-600 hover:text-blue-800"
        >
          <Edit2
            className="text-gray-500 group-hover:scale-x-125 transition-all duration-300 "
            size={14}
          />
        </button>
      </div>
    </div>
  );
};

// Card for DragOverlay (shows when dragging)
const CategoryCard = ({ brand }) => {
  return (
    <div
      className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden 
    flex flex-col ring-2 ring-blue-500 "
    >
      <div
        className="h-24 bg-gray-200 relative"
        style={{
          backgroundImage: brand.ImageUrl ? `url(${brand.ImageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!brand.ImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate">
          {brand.BrandName}
        </h3>
      </div>
    </div>
  );
};

const BrandGrid = ({ brands, handleEditBrand, refetch }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const updateTimer = useRef(null);

  const putBrandOrder = useEditBrandOrder();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize grid items when brands change
  useEffect(() => {
    if (brands && brands.length > 0) {
      setItems(
        brands.map((category, index) => ({
          ...category,
          // order: category.sortOrder || index + 1,
          order: index + 1,
        }))
      );
    }
  }, [brands]);

  // Save order after delay when changes occur
  useEffect(() => {
    if (orderChanged) {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }

      updateTimer.current = setTimeout(() => {
        saveOrder();
        setOrderChanged(false);
      }, 1500); // 1.5 second delay
    }

    return () => {
      if (updateTimer.current) {
        clearTimeout(updateTimer.current);
      }
    };
  }, [orderChanged, items]);

  const saveOrder = async () => {
    try {
      const orderData = items.map((item, index) => ({
        brandName: item.Name,
        imageUrl: item.ImageUrl,
        sortOrder: index + 1,
        isActive: item.IsActive,
        brandID: item.Id,
      }));
      await putBrandOrder.mutateAsync(orderData, {
        onSuccess: () => {
          refetch();
        },
      });
    } catch (error) {
      console.error("Error updating category order:", error);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(
          (item) => item.Id.toString() === active.id
        );
        const newIndex = items.findIndex(
          (item) => item.Id.toString() === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });

      setOrderChanged(true);
    }
  };

  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No brands found</p>
      </div>
    );
  }

  // Find active item for drag overlay
  const activeItem = activeId
    ? items.find((item) => item.Id.toString() === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.Id.toString())}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
          {items.map((brand) => (
            <SortableCategoryCard
              key={brand.Id}
              brand={brand}
              handleEditBrand={handleEditBrand}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - shows while dragging */}
      <DragOverlay adjustScale={true}>
        {activeItem ? (
          <div style={{ width: "100%", maxWidth: "250px" }}>
            <CategoryCard brand={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default BrandGrid;
