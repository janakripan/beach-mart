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
  getPaymentModes,
  getOrderes,
  uploadImage,
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
export const useAddBanner = () =>
  useMutation({
    mutationKey: ["addBanner"],
    mutationFn: addBanner,
  });

// EDIT BANNER
export const useEditBanner = () =>
  useMutation({
    mutationKey: ["editBanner"],
    mutationFn: editBanner,
  });

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



//////////////////////   VARIANTS SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////



//////////////////////   DELIVERY LOCATION SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetDeliveryLocations = () =>
  useQuery({
    queryKey: ["getDeliveryLocations"],
    queryFn: getDeliveryLocations,
    select: (data) => data.data || [],
  });

//////////////////////   DELIVERY MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetDeliveryModes = () =>
  useQuery({
    queryKey: ["getDeliveryModes"],
    queryFn: getDeliveryModes,
    select: (data) => data.data || [],
  });

//////////////////////   PAYMENT MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const useGetPaymentModes = () =>
  useQuery({
    queryKey: ["getPaymentModes"],
    queryFn: getPaymentModes,
    select: (data) => data.data || [],
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


