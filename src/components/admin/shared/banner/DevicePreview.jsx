import React, { useState, useEffect } from "react";
import { BANNER_DEV_CONFIG } from "../constant";
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

// Sortable Banner Item Component
const SortableBannerItem = ({ banner, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-full border-b border-gray-200 overflow-hidden cursor-grab
        ${isDragging ? "ring-2 ring-blue-500" : ""}`}
      {...attributes}
      {...listeners}
    >
      {banner.imageUrl ? (
        <img
          src={banner.imageUrl}
          alt={`banner ${index + 1}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <p>No image uploaded for Banner {index + 1}</p>
        </div>
      )}
    </div>
  );
};

export const DevicePreview = ({
  deviceType,
  bannerImages,
  setShowPreview,
  handleOrderArrangement,
}) => {
  const config = BANNER_DEV_CONFIG[deviceType];
  const [banners, setBanners] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize banners when bannerImages changes
  useEffect(() => {
    const bannerArray = [1, 2, 3, 4, 5, 6].map((index) => ({
      id: `banner_${index}`,
      imageUrl: bannerImages[`imgurl_${index}`],
      index: index,
    }));
    setBanners(bannerArray);
  }, [bannerImages]);

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBanners((items) => {
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
      const arrangeOrder = {};
      // Initialize all imgurl keys
      for (let i = 1; i <= 6; i++) {
        arrangeOrder[`imgurl_${i}`] = "";
      }
      // Update with the new arrangement
      banners.forEach((banner, index) => {
        // The position (index+1) now contains the image that was originally at banner.originalIndex
        arrangeOrder[`imgurl_${index + 1}`] = banner.imageUrl || "";
      });
      // Send to the backend and wait for completion
      await handleOrderArrangement(arrangeOrder, deviceType);
      setShowPreview(false);
    } catch (error) {
      console.error("Error saving banner order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {config.displayName} Preview & Reorder
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm">
          <p className="text-yellow-800 font-medium">Important:</p>
          <p className="text-yellow-700">
            These images will ONLY appear on {config.displayName.toLowerCase()}{" "}
            devices. Drag items to rearrange their order.
          </p>
        </div>

        <div
          style={{ maxWidth: config.previewWidth }}
          className="mx-auto border-8 border-gray-800 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="bg-gray-800 text-white text-xs py-1 px-2 text-center">
            {config.displayName} View
          </div>
          <div className="bg-white">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={banners.map((banner) => banner.id)}
                strategy={verticalListSortingStrategy}
              >
                {banners.map((banner, index) => (
                  <div key={banner.id} className={config.aspectRatio}>
                    <SortableBannerItem banner={banner} index={index} />
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 text-white bg-black  rounded hover:bg-[#024541]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Order"}
          </button>
        </div>
      </div>
    </div>
  );
};
