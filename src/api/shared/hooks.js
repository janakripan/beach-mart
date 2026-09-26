import { useQuery } from "@tanstack/react-query";
import { transformImageUrls } from "../../utils/transformImageUrls";
import { BANNER_INITIAL_VALUE } from "../../components/admin/shared/constant";
import {
  getBanner,
  getProducts,
  getCategories,
  getVariants,
} from "./service";

export const useGetBanner = () =>
  useQuery({
    queryKey: ["getBanners"],
    queryFn: getBanner,
    select: (data) => {
      if (!data || data.length === 0) return BANNER_INITIAL_VALUE;
      const response = data[0];
      const desktop =
        response.WebBrandingData && response.WebBrandingData !== ""
          ? transformImageUrls(JSON.parse(response.WebBrandingData))
          : BANNER_INITIAL_VALUE.desktop;

      const tab =
        response.TabBrandingData && response.TabBrandingData !== ""
          ? transformImageUrls(JSON.parse(response.TabBrandingData))
          : BANNER_INITIAL_VALUE.tab;

      const mobile =
        response.MobileBrandingData && response.MobileBrandingData !== ""
          ? transformImageUrls(JSON.parse(response.MobileBrandingData))
          : BANNER_INITIAL_VALUE.mobile;
      return { desktop, tab, mobile };
    },
  });

export const useGetProducts = (paginationParams = {}) => {
  return useQuery({
    queryKey: ["getProducts", paginationParams],
    queryFn: () => getProducts(paginationParams),
    select: (data) => ({
      products: data.data || [],
      totalCount: data.filterTotalCount || data.data?.length || 0,
      totalPages: Math.ceil((data?.filterTotalCount || data.data?.length || 0) / (paginationParams.pageSize || 10)),
    }),
  });
};

export const useGetCategories = () =>
  useQuery({
    queryKey: ["getCategories"],
    queryFn: getCategories,
    select: (data) => data.data || [],
  });

export const useGetVariants = () =>
  useQuery({
    queryKey: ["getVariants"],
    queryFn: getVariants,
    select: (data) => data.data || [],
  });
