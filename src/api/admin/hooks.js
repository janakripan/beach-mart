import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transformImageUrls } from "../../utils/transformImageUrls";
import { BANNER_INITIAL_VALUE } from "../../components/admin/shared/constant";
import {
  activeProduct,
  addBanner,
  addProduct,
  adminLogin,
  deleteImage,
  deleteProduct,
  editBanner,
  editProduct,
  getDeliveryLocations,
  getDeliveryModes,
  getOrderes,
  uploadImage,
  addCategory,
  updateCategory,
  deleteCategory,
  activeCategory,
  toggleVariantActive,
  saveVariantMaster,
  getPaymentModes,
  saveDeliveryLocation,
  saveDeliveryMode,
  savePaymentMode
} from "./service";
import { useState } from "react";
export { useGetBanner, useGetProducts, useGetCategories, useGetVariants } from "../shared/hooks";

//////////////////////   IMAGEG UPLOAD AND DELETE ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////
// IMAGE UPLOAD
export const useImageUpload = () =>
  useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: uploadImage,
  });
// IMAGE DELETE
export const useImageDelete = () =>
  useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: deleteImage,
  });
// ADMIN LOGIN
export const useAdminLogin = () =>
  useMutation({
    mutationKey: ["adminLogin"],
    mutationFn: adminLogin,
  });




//////////////////////   BANNER SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////
// ADD BANNER
export const useAddBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["addBanner"],
    mutationFn: addBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBanners"] });
    },
  });
};

// EDIT BANNER
export const useEditBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["editBanner"],
    mutationFn: editBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getBanners"] });
    },
  });
};

//////////////////////   PRODUCT SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

// ADD PRODUCT
export const useAddProducts = () =>
  useMutation({
    mutationKey: ["addProduct"],
    mutationFn: addProduct,
  });
// EDIT PRODUCT
export const useEditProduct = () =>
  useMutation({
    mutationKey: ["editProduct"],
    mutationFn: editProduct,
  });
// ACTIVE PRODUCT
export const useActiveProduct = () =>
  useMutation({
    mutationKey: ["activeProduct"],
    mutationFn: ({productId,status}) => activeProduct({ productId,status }),
  });
// DELETE PRODUCT
export const useDeleteProduct = () =>
  useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: deleteProduct,
  });

//////////////////////   CATEGORY SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////
export const useAddCategory = () =>
  useMutation({
    mutationKey: ["addCategory"],
    mutationFn: addCategory,
  });

export const useEditCategory = () =>
  useMutation({
    mutationKey: ["editCategory"],
    mutationFn: updateCategory,
  });

export const useDeleteCategory = () =>
  useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: deleteCategory,
  });

export const useActiveCategory = () =>
  useMutation({
    mutationKey: ["activeCategory"],
    mutationFn: activeCategory,
  });

//////////////////////   VARIANTS SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useActiveVariant = () =>
  useMutation({
    mutationKey: ["activeVariant"],
    mutationFn: toggleVariantActive,
  });

export const useSaveVariant = () =>
  useMutation({
    mutationKey: ["saveVariant"],
    mutationFn: saveVariantMaster,
  });



//////////////////////   DELIVERY LOCATION SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetDeliveryLocations = () =>
  useQuery({
    queryKey: ["getDeliveryLocations"],
    queryFn: getDeliveryLocations,
    select: (data) => data.data || [],
  });

export const useSaveDeliveryLocation = () =>
  useMutation({
    mutationKey: ["saveDeliveryLocation"],
    mutationFn: saveDeliveryLocation,
  });

//////////////////////   DELIVERY MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetDeliveryModes = () =>
  useQuery({
    queryKey: ["getDeliveryModes"],
    queryFn: getDeliveryModes,
    select: (data) => data.data || [],
  });

export const useSaveDeliveryMode = () =>
  useMutation({
    mutationKey: ["saveDeliveryMode"],
    mutationFn: saveDeliveryMode,
  });

//////////////////////   PAYMENT MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetPaymentModes = () =>
  useQuery({
    queryKey: ["getPaymentModes"],
    queryFn: getPaymentModes,
    select: (data) => data.data || [],
  });

export const useSavePaymentMode = () =>
  useMutation({
    mutationKey: ["savePaymentMode"],
    mutationFn: savePaymentMode,
  });

//////////////////////   ORDER SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

// GET ORDERES
export const useGetOrders = (paginationParams = {}) => {
  return useQuery({
    queryKey: ["getOrderes", paginationParams],
    queryFn: () => getOrderes(paginationParams),
    select: (data) => ({
      orders: data.data?.orders || [],
      totalCount: data.data?.pageContext?.[0]?.TotalRecords || 0,
      totalPages: data.data?.pageContext?.[0]?.TotalPages || 1,
    }),
  });
};

// Dummy hooks for Advertisement to prevent syntax errors since endpoints were deleted
export const useAddAdvertisement = () => ({
  mutate: () => {}
});

export const useGetAdvertisement = () => ({
  data: [],
  isLoading: false
});


