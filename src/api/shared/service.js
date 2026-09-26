import apiClient from "../apiClient";
import {
  GET_BANNER,
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_VARIANT,
} from "./endpoint";

export const getBanner = () => apiClient.get(GET_BANNER).then((res) => res.data.data);

export const getProducts = async ({
  page = 1,
  pageSize = 5,
  productID = null,
  productName = null,
  categoryID = null,
  brandID = null,
} = {}) => {
  const headers = {};

  headers.page = page;
  headers.pageSize = pageSize;

  if (productID) headers.productID = productID;
  if (productName) headers.productName = productName;
  if (categoryID) headers.categoryID = categoryID;
  if (brandID) headers.brandID = brandID;

  const response = await apiClient.get(GET_PRODUCTS, { headers });
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get(GET_CATEGORIES);
  return response.data;
};

export const getVariants = async () => {
  const response = await apiClient.get(GET_VARIANT);
  return response.data;
};
