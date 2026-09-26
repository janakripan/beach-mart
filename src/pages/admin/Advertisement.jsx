import React, { useState, useRef, useEffect } from "react";
import ImageUploader from "../../components/shared/ImageUploader";
import { MdOutlineDragIndicator } from "react-icons/md";
import {
  useAddAdvertisement,
  useGetAdvertisement,
  useGetProducts,
} from "../../api/admin/hooks";
import { useMessage } from "../../components/admin/MessageBox/useMessage";
import { Combobox } from "@headlessui/react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { AdvertisementPreview } from "../../components/admin/shared/advertisement/AdvertisementPreview";

const Advertisement = () => {
  const [advertisementData, setAdvertisementData] = useState({
    image1: { productID: "", productName: "", imageUrl: null, sortOrder: 1 },
    image2: { productID: "", productName: "", imageUrl: null, sortOrder: 2 },
    image3: { productID: "", productName: "", imageUrl: null, sortOrder: 3 },
    image4: { productID: "", productName: "", imageUrl: null, sortOrder: 4 },
    image5: { productID: "", productName: "", imageUrl: null, sortOrder: 5 },
    image6: { productID: "", productName: "", imageUrl: null, sortOrder: 6 },
  });

  const [searchQueries, setSearchQueries] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  const productIdRefs = {
    image1: useRef(null),
    image2: useRef(null),
    image3: useRef(null),
    image4: useRef(null),
    image5: useRef(null),
    image6: useRef(null),
  };

  const message = useMessage();
  const addAdvertisementMutation = useAddAdvertisement();
  const { data: existingAdvertisements, isLoading } = useGetAdvertisement();

  // Get products for each search query
  const { data: productsData1 } = useGetProducts({
    productName: searchQueries.image1,
    pageSize: 10,
  });
  const { data: productsData2 } = useGetProducts({
    productName: searchQueries.image2,
    pageSize: 10,
  });
  const { data: productsData3 } = useGetProducts({
    productName: searchQueries.image3,
    pageSize: 10,
  });
  const { data: productsData4 } = useGetProducts({
    productName: searchQueries.image4,
    pageSize: 10,
  });
  const { data: productsData5 } = useGetProducts({
    productName: searchQueries.image5,
    pageSize: 10,
  });
  const { data: productsData6 } = useGetProducts({
    productName: searchQueries.image6,
    pageSize: 10,
  });

  const productsData = {
    image1: productsData1?.products || [],
    image2: productsData2?.products || [],
    image3: productsData3?.products || [],
    image4: productsData4?.products || [],
    image5: productsData5?.products || [],
    image6: productsData6?.products || [],
  };

  useEffect(() => {
    if (existingAdvertisements && existingAdvertisements.length > 0) {
      const updatedData = { ...advertisementData };

      existingAdvertisements.forEach((ad) => {
        const imageKey = `image${ad.sortOrder}`;
        if (updatedData[imageKey]) {
          updatedData[imageKey] = {
            productID: ad.productID.toString(),
            productName: ad.productName || "",
            imageUrl: ad.imageUrl,
            sortOrder: ad.sortOrder,
          };
        }
      });

      setAdvertisementData(updatedData);
    }
  }, [existingAdvertisements]);

  const handleAdvertisementUpdate = (updatedData) => {
    const validAdvertisements = Object.entries(updatedData)
      .filter(([_, data]) => data.imageUrl && data.productID)
      .map(([_, data]) => ({
        productID: parseInt(data.productID),
        productName: data.productName,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder,
      }));

    if (validAdvertisements.length > 0) {
      addAdvertisementMutation.mutate(validAdvertisements, {
        onSuccess: () => {
          message.success("Advertisement updated successfully");
        },
        onError: (error) => {
          message.error(error.message || "Failed to update advertisement");
        },
      });
    }
  };

  const handleImageUpload = (index, data) => {
    const imageKey = `image${index}`;
    setAdvertisementData((prev) => {
      const updatedData = {
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          imageUrl: data.FileDetails?.[0]?.FileUrl || null,
        },
      };

      // Call API with updated data
      handleAdvertisementUpdate(updatedData);

      // Focus on product search when image is uploaded
      if (data.FileDetails?.[0]?.FileUrl) {
        productIdRefs[imageKey].current?.focus();
      }

      return updatedData;
    });
  };

  const handleImageDelete = (index) => {
    const imageKey = `image${index}`;
    setAdvertisementData((prev) => {
      const updatedData = {
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          imageUrl: null,
          productID: "", // Clear product ID when image is deleted
          productName: "", // Clear product name when image is deleted
        },
      };

      // Call API with updated data
      handleAdvertisementUpdate(updatedData);

      return updatedData;
    });
  };

  const handleProductSelect = (index, product) => {
    if (!product) return;
    const imageKey = `image${index}`;
    setAdvertisementData((prev) => {
      const updatedData = {
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          productID: product?.productId?.toString(),
          productName: product?.productName || "",
        },
      };

      // Call API with updated data
      handleAdvertisementUpdate(updatedData);

      return updatedData;
    });
  };

  const handleOrderArrangement = async (updatedData) => {
    setAdvertisementData(updatedData);
    handleAdvertisementUpdate(updatedData);
  };

  if (isLoading) {
    return (
      <div className="p-6 w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading advertisements...</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full overflow-y-auto">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Advertisements</h2>
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 text-white bg-black 
            text-sm cursor-pointer rounded hover:bg-[#024541] flex items-center gap-2"
          >
            <MdOutlineDragIndicator className="w-5 h-5" />
            Preview & Reorder
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(advertisementData).map((image, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Advertisement Image {index + 1}
                </h3>
              </div>
              <ImageUploader
                aspectRatio="aspect-[16/9]"
                maxWidth="max-w-full"
                initialImage={advertisementData[image].imageUrl}
                buttonText="Upload Advertisement"
                placeholderText={`Upload advertisement image ${index + 1}`}
                minWidth={400}
                minHeight={225}
                max_Width={2000}
                maxHeight={2000}
                recommendedWidth={1600}
                recommendedHeight={900}
                onImageUpload={(data) => handleImageUpload(index + 1, data)}
                onImageDelete={() => handleImageDelete(index + 1)}
                containerClassName="mb-2"
              />
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product{" "}
                  {advertisementData[image].imageUrl && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <Combobox
                  value={
                    productsData[image].find(
                      (p) =>
                        p.productId?.toString() ===
                        advertisementData[image].productID
                    ) || null
                  }
                  onChange={(product) =>
                    handleProductSelect(index + 1, product)
                  }
                  disabled={!advertisementData[image].imageUrl}
                >
                  <div className="relative">
                    <div className="relative w-full">
                      <Combobox.Input
                        ref={productIdRefs[image]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                        onChange={(event) =>
                          setSearchQueries((prev) => ({
                            ...prev,
                            [image]: event.target.value,
                          }))
                        }
                        displayValue={(product) => product?.productName || ""}
                        placeholder="Search product..."
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <FiChevronDown className="h-5 h-5 text-gray-400" />
                      </Combobox.Button>
                    </div>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {productsData[image].length === 0 ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          No products found.
                        </div>
                      ) : (
                        productsData[image].map((product) => (
                          <Combobox.Option
                            key={product.productId}
                            value={product}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-3 pr-9 ${active
                                ? "bg-black text-white"
                                : "text-gray-900"
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? "font-medium" : "font-normal"
                                    }`}
                                >
                                  {product.productName}
                                </span>
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <AdvertisementPreview
          advertisements={advertisementData}
          setShowPreview={setShowPreview}
          handleOrderArrangement={handleOrderArrangement}
        />
      )}
    </div>
  );
};

export default Advertisement;
