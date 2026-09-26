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
import { Trash2 } from "lucide-react";
import ErrorDisplay from "../shared/ErrorDisplay";
import TableSkeleton from "../shared/TableSkeleton";

// Sortable Category Card Component
const SortableCategoryCard = ({ category, handleEditCategory, handleDeleteSingle, handleToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.Id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => handleEditCategory(category)}
      className={`bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col cursor-pointer
        ${isDragging ? "ring-2 ring-blue-500" : ""}`}
    >
      <div
        className="h-42 bg-gray-200 overflow-hidden relative cursor-grab"
        {...attributes}
        {...listeners}
      >
        {category.ImageUrl && category.ImageUrl !== "" && (
          <img
            src={category.ImageUrl}
            className="w-full h-full object-contain"
          />
        )}

        {!category.ImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
          {category.Name}
        </h3>

        <div className="flex justify-between items-center mt-2">
          <div
            title={category.IsActive ? "Deactivate" : "Activate"}
            onClick={(e) => {
              e.stopPropagation();
              if (handleToggleActive) handleToggleActive(category);
            }}
            className="relative cursor-pointer"
          >
            <input type="checkbox" className="sr-only" checked={category.IsActive} readOnly />
            <div className={`block w-8 h-4 rounded-full transition-colors ${category.IsActive ? "bg-primary" : "bg-gray-300"}`} />
            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${category.IsActive ? "transform translate-x-4" : ""}`} />
          </div>

          <button
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSingle(category);
            }}
            className="text-sm cursor-pointer group text-red-600 hover:text-red-800"
          >
            <Trash2
              className="text-gray-500 group-hover:scale-110 transition-all duration-300 hover:text-red-600"
              size={14}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

// Card for DragOverlay (shows when dragging)
const CategoryCard = ({ category }) => {
  return (
    <div
      className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden 
    flex flex-col ring-2 ring-blue-500 "
    >
      <div className="h-24 bg-gray-200 relative">
        {category.ImageUrl && category.ImageUrl !== "" && (
          <img
            src={category.ImageUrl}
            className="w-full h-full object-contain"
          />
        )}
        {!category.ImageUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-800 mb-1 truncate">
          {category.CategoryName}
        </h3>
      </div>
    </div>
  );
};

const CategoryGrid = ({
  categories,
  handleEditCategory,
  handleDeleteSingle,
  handleToggleActive,
  onReorder,
  isError,
  isLoading,
}) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const updateTimer = useRef(null);

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

  // Initialize grid items when categories change
  useEffect(() => {
    if (categories && categories.length > 0) {
      setItems(
        categories.map((category, index) => ({
          ...category,
          // order: category.sortOrder || index + 1,
          order: index + 1,
        }))
      );
    }
  }, [categories]);

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
      if (onReorder) {
        onReorder(items);
      }
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
  if (isLoading) {
    return <TableSkeleton />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        className="h-full flex items-center justify-center"
        message="Failed to load categories" // Consider adding an error message
      />
    );
  }

  if (!items.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No categories found</p>
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
          {items.map((category) => (
            <SortableCategoryCard
              key={category.Id}
              category={category}
              handleEditCategory={handleEditCategory}
              handleDeleteSingle={handleDeleteSingle}
              handleToggleActive={handleToggleActive}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - shows while dragging */}
      <DragOverlay adjustScale={true}>
        {activeItem ? (
          <div style={{ width: "100%", maxWidth: "250px" }}>
            <CategoryCard category={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default CategoryGrid;
