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

export const deleteImage = async (url) => {
  // Extract the filename from the URL
  const urlParts = url.split("/");
  const filename = urlParts[urlParts.length - 1];
  const thumbFilename = `thumb_${filename}`;
  // Create the request payload
  const payload = {
    fileNames: [filename, thumbFilename],
  };
  const response = await axios.delete(IMAGE_DELETE_ENDPOINT, {
    headers: {
      Token: import.meta.env.VITE_UPLOAD_TOKEN,
      clientID: import.meta.env.VITE_CLIENT_ID,
      imageClassification: "dtac",
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
  apiClient.put(
    ACTIVE_PRODUCT,
    {},
    {
      headers: {
        productID: productId,
      },
      params: {
      isActive: !status,
    },
    }
  );
};

//////////////////////   CATEGORY SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////



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

