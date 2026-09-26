import axios from "axios";
import {
  ACTIVE_PRODUCT,
  ADMIN_LOGIN,
  
  EDIT_PRODUCT,
  GET_ORDERS,
  GET_DELIVERY_LOCATION,
  GET_DELIVERY_MODES,
  GET_PAYMENT_MODES,
  IMAGE_DELETE_ENDPOINT,
  IMAGE_UPLOAD_ENDPOINT,
  POST_BANNER,

  POST_PRODUCT,
  PUT_BANNER,
  DELETE_PRODUCT,
  POST_CATEGORIES,
  PUT_CATEGORIES,
  ACTIVATE_CATEGORY,
  DELETE_CATEGORIES,
} from "./endpoint";
import apiClient from "../apiClient";
export { getProducts, getCategories, getVariants, getBanner } from "../shared/service";

//////////////////////   IMAGEG UPLOAD AND DELETE ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const uploadImage = async ({file, category}) => {
  const formData = new FormData();
  formData.append("imageFiles", file);
  const response = await axios.post(IMAGE_UPLOAD_ENDPOINT, formData, {
    headers: {
      // "Content-Type": "multipart/form-data",
      clientID: import.meta.env.VITE_CLIENT_ID,
      Token: import.meta.env.VITE_UPLOAD_TOKEN,
      imageClassification: category,
    },
  });
  return response.data;
};

export const deleteImage = async ({url, category = "products"}) => {
  // Extract the filename from the URL
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];
  
  // Create the request payload with just the filename
  const payload = {
    fileNames: [filename],
  };
  const response = await axios.delete(IMAGE_DELETE_ENDPOINT, {
    headers: {
      Token: import.meta.env.VITE_UPLOAD_TOKEN,
      clientID: import.meta.env.VITE_CLIENT_ID,
      imageClassification: category,
      "Content-Type": "application/json",
    },
    data: payload,
  });

  return response.data;
};

//////////////////////   ADMIN AUTH ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const adminLogin = (credential) =>
  apiClient.post(ADMIN_LOGIN, {
    email: credential.username,
    Password: credential.password,
  }).then((res) => res.data);






//////////////////////   BANNER SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const addBanner = (bannerDetails) =>
  apiClient.post(POST_BANNER, { ...bannerDetails, settings: "" }).then(
    (res) => res.data
  );



export const editBanner = (updatedBanners) =>
  apiClient.put(PUT_BANNER, updatedBanners).then((res) => res.data);

//////////////////////   PRODUCT SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////



export const addProduct = (productDetails) =>
  apiClient.post(POST_PRODUCT, productDetails).then((res) => res.data);

export const editProduct = ({ updatedProduct, productId }) =>
  apiClient.put(EDIT_PRODUCT, updatedProduct, {
    headers: {
      productID: productId,
    },
  });
export const activeProduct = ({ productId, status }) => {
  return apiClient.put(
    ACTIVE_PRODUCT,
    {},
    {
      headers: {
        productID: productId,
        _status: String(!status),
      },
    }
  ).then(res => res.data);
};

export const deleteProduct = (productId) => {
  return apiClient.delete(DELETE_PRODUCT, {
    headers: {
      productID: productId,
    },
  }).then(res => res.data);
};

//////////////////////   CATEGORY SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////
//////////////////////   CATEGORIES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const addCategory = async (categoryData) => {
  const response = await apiClient.post(POST_CATEGORIES, categoryData);
  return response.data;
};

export const updateCategory = async ({categoryData, categoryId}) => {
  const response = await apiClient.put(PUT_CATEGORIES, categoryData, {
    headers: {
      id: categoryId
    }
  });
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await apiClient.delete(DELETE_CATEGORIES, {
    headers: {
      categoryID: categoryId
    }
  });
  return response.data;
};

export const activeCategory = async ({ categoryId, status }) => {
  const response = await apiClient.put(ACTIVATE_CATEGORY, {}, {
    headers: {
      categoryID: categoryId,
      _status: status.toString()
    }
  });
  return response.data;
};
//////////////////////   VARIANTS SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////



//////////////////////   DELIVERY LOCATION SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getDeliveryLocations = async () => {
  const response = await apiClient.get(GET_DELIVERY_LOCATION);
  return response.data;
};

//////////////////////   DELIVERY MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getDeliveryModes = async () => {
  const response = await apiClient.get(GET_DELIVERY_MODES);
  return response.data;
};

//////////////////////   PAYMENT MODES SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getPaymentModes = async () => {
  const response = await apiClient.get(GET_PAYMENT_MODES);
  return response.data;
};

//////////////////////   ORDER SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////
export const getOrderes = async ({
  isAdmin = true,
  pageNo = 1,
  pageSize = 10,
  email = null,
  orderID = null,
  fromdate = null,
  todate = null,
  orderStatus = null,
}) => {
  const headers = {};
  headers.isAdmin = true,
  // Add pagination parameters
  headers.pageno = pageNo;
  headers.pagesize = pageSize;

  // Add optional filter parameters if they exist
  if (email) headers.email = email;
  if (orderID) headers.orderID = orderID;
  if (fromdate) headers._fromdate = fromdate;
  if (todate) headers._todate = todate;
  if (orderStatus) headers.orderStatus = orderStatus;

  const response = await apiClient.get(GET_ORDERS, {
    headers,
  });
  return response.data;
};

