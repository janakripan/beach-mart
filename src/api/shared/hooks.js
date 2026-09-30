import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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
      const response = data[0] || data; // Just in case it's an object, not an array
      console.log("RAW BACKEND BANNER RESPONSE:", data, "PARSED RESPONSE OBJ:", response);
      
      // Handle the new ecom banner flat format
      if (response.DesktopImgurl_1 !== undefined) {
        return {
          desktop: [{
            imgurl_1: response.DesktopImgurl_1 || "",
            imgurl_2: response.DesktopImgurl_2 || "",
            imgurl_3: response.DesktopImgurl_3 || "",
            imgurl_4: response.DesktopImgurl_4 || "",
            imgurl_5: response.DesktopImgurl_5 || "",
            imgurl_6: response.DesktopImgurl_6 || "",
          }],
          mobile: [{
            imgurl_1: response.MobileImgurl_1 || "",
            imgurl_2: response.MobileImgurl_2 || "",
            imgurl_3: response.MobileImgurl_3 || "",
            imgurl_4: response.MobileImgurl_4 || "",
            imgurl_5: response.MobileImgurl_5 || "",
            imgurl_6: response.MobileImgurl_6 || "",
          }],
          tab: [{
            imgurl_1: response.TabImgurl_1 || "",
            imgurl_2: response.TabImgurl_2 || "",
            imgurl_3: response.TabImgurl_3 || "",
            imgurl_4: response.TabImgurl_4 || "",
            imgurl_5: response.TabImgurl_5 || "",
            imgurl_6: response.TabImgurl_6 || "",
          }],
          settings: response.Settings || "",
          isExisting: true,
        };
      }

      // Handle the legacy WebBrandingData format
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
          
      return { desktop, tab, mobile, isExisting: true };
    },
  });

export const useGetProducts = (paginationParams = {}, options = {}) => {
  return useQuery({
    queryKey: ["getProducts", paginationParams],
    queryFn: () => getProducts(paginationParams),
    select: (data) => ({
      products: data.data || [],
      totalCount: data.filterTotalCount || data.data?.length || 0,
      totalPages: Math.ceil((data?.filterTotalCount || data.data?.length || 0) / (paginationParams.pageSize || 10)),
    }),
    ...options,
  });
};

export const useGetInfiniteProducts = (paginationParams = {}) => {
  return useInfiniteQuery({
    queryKey: ["getInfiniteProducts", paginationParams],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getProducts({ ...paginationParams, page: pageParam });
      return {
        products: data.data || [],
        totalCount: data.filterTotalCount || data.data?.length || 0,
        page: pageParam,
        pageSize: paginationParams.pageSize || 20,
      };
    },
    getNextPageParam: (lastPage) => {
      const { products, page, pageSize, totalCount } = lastPage;
      // If we loaded less items than pageSize, we have reached the end
      if (products.length < pageSize) {
        return undefined;
      }
      // If totalCount is reliably provided by backend, use it
      if (totalCount > pageSize && (page * pageSize) >= totalCount) {
        return undefined;
      }
      return page + 1;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes cache to prevent refetching during navigation
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
