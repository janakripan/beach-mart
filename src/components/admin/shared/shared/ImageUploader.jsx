import React, { useState, useRef, useCallback, useEffect } from "react";
import { Trash2, Edit3, Upload, Loader, AlertCircle } from "lucide-react";
import { useImageUpload } from "../../../../api/admin/hooks";
import { useImageDelete } from "../../../../api/admin/hooks"; // Import the delete hook
import loader from "../../../../assets/dashboard/loader2.svg";

const ImageUploader = ({
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-square",
  maxWidth = "max-w-md",
  onImageUpload = () => {},
  onImageDelete = () => {}, // Add callback for successful deletion
  initialImage = null,
  buttonText = "Upload Image",
  placeholderText = "Drag & drop an image here, or click to select",
  minWidth = 100,
  minHeight = 100,
  max_Width = 600,
  maxHeight = 600,
  recommendedWidth = 300,
  recommendedHeight = 300,
  maxFileSize = 1024 * 1024, // 1 MB in bytes
  category=""
}) => {
  const [image, setImage] = useState(initialImage);
  const [previewImage, setPreviewImage] = useState(initialImage); // Separate state for preview
  const [isDragging, setIsDragging] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [error, setError] = useState(null);
  const [dimensions, setDimensions] = useState(null);
  const fileInputRef = useRef(null);

  // Track upload state separately from the useImageUpload hook's isLoading
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate: uploadImage, isLoading: isLoadingUpload } = useImageUpload();
  const { mutate: deleteImage, isLoading: isLoadingDelete } = useImageDelete();

  // Update internal state when initialImage prop changes
  useEffect(() => {
    // Only update if different to prevent unnecessary renders
    if (initialImage !== image) {
      setImage(initialImage);
      setPreviewImage(initialImage);

      // If initialImage changes and we have dimensions, reset them
      // as they might not apply to the new image
      if (initialImage !== image && dimensions) {
        // If an image is provided, try to get its dimensions
        if (initialImage) {
          const img = new Image();
          img.onload = () => {
            setDimensions({ width: img.width, height: img.height });
          };
          img.src = initialImage;
        } else {
          setDimensions(null);
        }
      }
    }
  }, [initialImage]);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging) setIsDragging(true);
    },
    [isDragging]
  );

  const validateImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        setDimensions({ width, height });

        if (width < minWidth || height < minHeight) {
          reject(`Image too small. Minimum size: ${minWidth}x${minHeight}px`);
        } else if (width > max_Width || height > maxHeight) {
          reject(`Image too large. Maximum size: ${max_Width}x${maxHeight}px`);
        } else {
          resolve(file);
        }
      };

      img.onerror = () => reject("Failed to load image");
      img.src = URL.createObjectURL(file);
    });
  };

  // Helper function to delete an image URL
  const deleteImageFromServer = (imageUrl) => {
    return new Promise((resolve, reject) => {
      if (!imageUrl || !imageUrl.startsWith("http")) {
        resolve(); // Nothing to delete
        return;
      }

      deleteImage(imageUrl, {
        onSuccess: () => {
          onImageDelete && onImageDelete(imageUrl);
          onImageUpload &&
            onImageUpload({
              FileDetails: [
                {
                  FileUrl: null,
                },
              ],
            });
          resolve();
        },
        onError: (error) => {
          console.error("Error deleting image:", error);
          reject(error);
        },
      });
    });
  };

  const processFile = useCallback(
    (file) => {
      // Clear previous errors
      setError(null);

      // Start the upload process
      setIsUploading(true);

      // Check if file is an image
      if (!file || !file.type.match("image.*")) {
        setError("Please upload a valid image file");
        setIsUploading(false);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(1);
        setError(
          `File size too large. Maximum allowed size is ${maxSizeMB} MB`
        );
        setIsUploading(false);
        return;
      }

      // Store the current image URL for deletion after successful upload
      const oldImageUrl = image;

      // Store dimensions for later, but don't show image yet
      validateImageDimensions(file)
        .then(() => {
          // Upload the image using our hook
          uploadImage({file, category}, {
            onSuccess: (data) => {
              // After successful upload, delete the old image if it exists
              if (oldImageUrl && oldImageUrl.startsWith("http")) {
                deleteImageFromServer(oldImageUrl).catch((error) => {
                  console.warn("Failed to delete old image:", error);
                  // Continue with the process even if deletion fails
                });
              }

              // Set the image from the server response
              if (data.FileDetails) {
                setImage(data.FileDetails[0].FileUrl);
                setPreviewImage(data.FileDetails[0].FileUrl);
              } else {
                // If no URL is returned, use the local file as fallback
                const reader = new FileReader();
                reader.onload = (e) => {
                  setImage(e.target.result);
                  setPreviewImage(e.target.result);
                };
                reader.readAsDataURL(file);
              }
              onImageUpload(data);
              setIsUploading(false);
            },
            onError: (error) => {
              console.error("Error uploading image:", error);
              setError("Failed to upload image. Please try again.");
              setIsUploading(false);
            },
          });
        })
        .catch((errorMsg) => {
          setError(errorMsg);
          setIsUploading(false);
        });
    },
    [
      uploadImage,
      onImageUpload,
      deleteImage,
      image,
      minWidth,
      minHeight,
      max_Width,
      maxHeight,
      maxFileSize,
    ]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
      }
    },
    [processFile]
  );

  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    if (!image) {
      return;
    }

    setIsDeleting(true);
    setShowEditMenu(false);

    // Only attempt to delete if we have a URL (not a local file)
    if (image && image.startsWith("http")) {
      deleteImageFromServer(image)
        .then(() => {
          setImage(null);
          setPreviewImage(null);
          setError(null);
          setDimensions(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        })
        .catch((error) => {
          setError("Failed to delete image. Please try again.");
        })
        .finally(() => {
          setIsDeleting(false);
        });
    } else {
      // For local files or when no URL is available
      setImage(null);
      setPreviewImage(null);
      setError(null);
      setDimensions(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsDeleting(false);
    }
  };

  const handleEditImage = () => {
    // When editing, we'll just open the file dialog
    // The actual delete of the old image will happen in processFile after successful upload
    fileInputRef.current.click();
    setShowEditMenu(false);
  };

  // Determine if we should show the loading state
  const showLoading =
    isLoadingUpload || isUploading || isLoadingDelete || isDeleting;

  return (
    <div className={`w-full mx-auto ${containerClassName}`}>
      <div
        className={`
          ${className}
          ${aspectRatio}
          w-full 
          rounded-lg
          overflow-hidden
          border-2
          relative
          transition-all
          ${
            isDragging
              ? "border-black bg-black/50"
              : error
              ? "border-red-500 bg-white"
              : "border-gray-200 bg-white"
          }
          ${
            previewImage && !showLoading
              ? ""
              : "cursor-pointer hover:bg-gray-100"
          }
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={
          !previewImage || showLoading
            ? handleClickUpload
            : () => setShowEditMenu(!showEditMenu)
        }
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {showLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center
          gap-y-3 justify-center bg-white bg-opacity-60 z-10"
          >
            <img src={loader} alt="" className="w-20" />
            <p className="text-gray-500 text-sm">
              {isDeleting || isLoadingDelete
                ? "Deleting image..."
                : "Uploading image..."}
            </p>
          </div>
        )}

        {!previewImage || showLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-xs text-gray-500 mb-2">{placeholderText}</p>
            <p className="text-xs text-blue-600 font-medium">
              Recommended size: {recommendedWidth}px × {recommendedHeight}px
            </p>
            <p className="text-xs text-gray-500">
              Min: {minWidth}px × {minHeight}px, Max: {max_Width}px ×{" "}
              {maxHeight}px
            </p>
            <p className="text-xs text-gray-500">
              Max file size: {(maxFileSize / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        ) : (
          <div className="relative min-h-[200px] h-full w-full">
            <img
              src={previewImage}
              alt="Uploaded content"
              className="w-full h-full object-cover"
              key={previewImage} // Add key to force re-render when image changes
            />

            {dimensions && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {dimensions.width} × {dimensions.height}px
              </div>
            )}

            {showEditMenu && (
              <div
                className="absolute top-0 bottom-10 my-auto h-fit left-0 right-0 bg-black/20
               bg-opacity-60 p-3 flex justify-center space-x-4"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditImage();
                  }}
                  className="p-2 rounded-full bg-black text-white hover:bg-blue-600
                  cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="p-2 rounded-full bg-black text-white
                  cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-red-600 
                  "
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-500 text-xs">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
