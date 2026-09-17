import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Advertisement Item Component
const SortableAdvertisementItem = ({ advertisement, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: advertisement.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 0.2s ease, opacity 0.2s ease",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full border-b border-gray-200 overflow-hidden cursor-grab
        ${
          isDragging
            ? "ring-2 ring-black scale-[1.02] shadow-lg"
            : "hover:shadow-md"
        }`}
      {...attributes}
      {...listeners}
    >
      {advertisement.imageUrl ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={advertisement.imageUrl}
            alt={`advertisement ${index + 1}`}
            className="w-full h-full object-contain"
          />
          {advertisement.productName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1 text-xs">
              {advertisement.productName}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          <p>No image uploaded for Advertisement {index + 1}</p>
        </div>
      )}
    </div>
  );
};

export const AdvertisementPreview = ({
  advertisements,
  setShowPreview,
  handleOrderArrangement,
}) => {
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize items when advertisements change
  useEffect(() => {
    const advertisementArray = Object.entries(advertisements).map(
      ([key, data]) => ({
        id: key,
        imageUrl: data.imageUrl,
        productName: data.productName,
        productID: data.productID,
        sortOrder: data.sortOrder,
      })
    );
    setItems(advertisementArray);
  }, [advertisements]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 0,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleClose = async () => {
    try {
      setIsSubmitting(true);
      // Create the object format for saving
      const updatedData = {};
      items.forEach((item, index) => {
        updatedData[`image${index + 1}`] = {
          imageUrl: item.imageUrl,
          productID: item.productID,
          productName: item.productName,
          sortOrder: index + 1,
        };
      });

      // Send to the backend and wait for completion
      await handleOrderArrangement(updatedData);
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving advertisement order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg p-4 w-[95%] sm:w-[80%] md:w-[70%] lg:w-[60%] max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold">Advertisement Preview & Reorder</h3>
          <button
            onClick={handleCancel}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-3 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-xs">
          <p className="text-yellow-800 font-medium">Important:</p>
          <p className="text-yellow-700">
            Drag items to rearrange their order. Product names will be displayed
            below each image.
          </p>
        </div>

        <div className="mx-auto border-4 border-gray-800 rounded-lg overflow-hidden shadow-lg w-full">
          <div className="bg-gray-800 text-white text-xs py-1 px-2 text-center">
            Advertisement Preview
          </div>
          <div className="bg-white">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="aspect-[16/9] max-h-[120px] w-full"
                  >
                    <SortableAdvertisementItem
                      advertisement={item}
                      index={index}
                    />
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-sm text-white bg-black rounded hover:bg-[#024541]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
