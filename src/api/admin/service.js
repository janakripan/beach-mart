import axios from "axios";
import {
  ACTIVE_PRODUCT,
  ADMIN_LOGIN,
  DELETE_BRAND,
  DELETE_CATEGORY,
  EDIT_PRODUCT,
  GET_ADVERTISEMENT,
  GET_ALL_USERS,
  GET_BANNER,
  GET_BRAND,
  GET_CATEGORY,
  GET_COLOR,
  GET_METRICS,
  GET_ORDERS,
  GET_PRODUCTS,
  GET_RECENT_ORDERS,
  GET_SELLING_PRODUCTS,
  GET_SIZE,
  GET_SUMMERY_CHART,
  GET_TOP_CUSTOMERS,
  IMAGE_DELETE_ENDPOINT,
  IMAGE_UPLOAD_ENDPOINT,
  POST_ADVERTISEMENT,
  POST_BANNER,
  POST_BRAND,
  POST_CATEGORY,
  POST_COLOR,
  POST_PRODUCT,
  POST_SIZE,
  PUT_BANNER,
  PUT_BRAND,
  PUT_CATEGORY,
  PUT_COLOR,
  PUT_COLOR_ACITVE,
  PUT_ORDER_STATUS,
  PUT_SIZE,
  PUT_SIZE_ACTIVE,
} from "./endpoint";
import apiClient from "../apiClient";

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

//////////////////////   CATEGORY SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getCategory = () =>
  apiClient.get(GET_CATEGORY).then((res) => res.data.data);

export const addCategory = (category) =>
  apiClient.post(POST_CATEGORY, {
    categoryName: category.name,
    categoryDescription: category.description,
    parentCategoryId: 0,
    imageUrl: category.imageUrl,
    isActive: category.IsActive,
    isMain: category.isMain,
  }).then((res) => res.data);

export const editCategory = ({ category, categoryId }) =>
  apiClient.put(
    PUT_CATEGORY,
    [
      {
        categoryName: category.name,
        categoryDescription: category.description,
        parentCategoryId: category.parentId,
        imageUrl: category.imageUrl,
        isActive: category.IsActive,
        isMain: category.isMain,
      },
    ],
    {
      headers: {
        categoryID: categoryId,
        bulkUpdate: false,
      },
    }
  );

export const editCategoryOrder = (category) =>
  apiClient.put(PUT_CATEGORY, category, {
    headers: {
      bulkUpdate: true,
    },
  });

export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(DELETE_CATEGORY, {
      headers: {
        categoryID: categoryId,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete category";

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

//////////////////////   BRAND SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getBrand = () => apiClient.get(GET_BRAND).then((res) => res.data.data);

export const addBrand = (newBrand) =>
  apiClient.post(POST_BRAND, newBrand).then((res) => res.data);

export const editBrand = ({ updatedBrand, brandId }) =>
  apiClient.put(PUT_BRAND, { brandID: brandId, ...updatedBrand }).then(
    (res) => res.data
  );

export const editBrandOrder = (brand) =>
  apiClient.put(PUT_BRAND, brand, {
    headers: {
      bulkUpdate: true,
    },
  });

export const deleteBrand = async (brandId) => {
  try {
    const response = await apiClient.delete(DELETE_BRAND, {
      headers: {
        brandID: brandId,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete brand";

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    throw enhancedError;
  }
};

//////////////////////   COLOR SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getColors = () => apiClient.get(GET_COLOR).then((res) => res.data.data);

export const addColor = (color) =>
  apiClient.post(POST_COLOR, {
    colors: [{ colorName: color.ColorName, hexCode: color.HexCode }],
  }).then((res) => res.data);

export const editColor = ({ updatedColor, colorId }) =>
  apiClient.put(
    PUT_COLOR,
    {
      colorName: updatedColor.ColorName,
      hexCode: updatedColor.HexCode,
    },
    {
      headers: {
        ColorId: colorId,
        isActive: String(updatedColor.isActive),
      },
    }
  ).then((res) => res.data);

export const activeColor = (active, colorId) =>
  apiClient.put(
    PUT_COLOR_ACITVE,
    {},
    {
      headers: {
        ColorId: colorId,
        IsActive: active,
      },
    }
  ).then((res) => res.data);

//////////////////////   SIZE SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getSizes = () => apiClient.get(GET_SIZE).then((res) => res.data.data);

export const addSize = (size) =>
  apiClient.post(
    POST_SIZE,
    {},
    {
      headers: {
        sizeLable: size.sizeLable,
      },
    }
  ).then((res) => res.data);

export const editSizee = ({ updatedSize, sizeId }) =>
  apiClient.put(
    PUT_SIZE,
    {},
    {
      headers: {
        SizeId: sizeId,
        sizeLable: updatedSize.sizeLable,
        isActive: updatedSize.isActive,
      },
    }
  ).then((res) => res.data);

export const activeSize = (active, sizeId) =>
  apiClient.put(
    PUT_SIZE_ACTIVE,
    {},
    {
      headers: {
        SizeId: sizeId,
        IsActive: active,
      },
    }
  ).then((res) => res.data);

//////////////////////   BANNER SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const addBanner = (bannerDetails) =>
  apiClient.post(POST_BANNER, { ...bannerDetails, settings: "" }).then(
    (res) => res.data
  );

export const getBanner = () => apiClient.get(GET_BANNER).then((res) => res.data.data);

export const editBanner = (updatedBanners) =>
  apiClient.put(PUT_BANNER, updatedBanners).then((res) => res.data);

//////////////////////   PRODUCT SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getProducts = async ({
  page = 1,
  pageSize = 5,
  productID = null,
  productName = null,
  categoryID = null,
  brandID = null,
}) => {
  // Create headers object with only the non-null parameters
  const headers = {};

  // Add pagination parameters
  headers.page = page;
  headers.pageSize = pageSize;

  // Add optional filter parameters if they exist
  if (productID) headers.productID = productID;
  if (productName) headers.productName = productName;
  if (categoryID) headers.categoryID = categoryID;
  if (brandID) headers.brandID = brandID;

  const response = await apiClient.get(GET_PRODUCTS, { headers });
  return response.data;
};

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
  headers.pageNo = pageNo;
  headers.pageSize = pageSize;

  // Add optional filter parameters if they exist
  if (email) headers.email = email;
  if (orderID) headers.orderID = orderID;
  if (fromdate) headers.fromdate = fromdate;
  if (todate) headers.todate = todate;
  if (orderStatus) headers.orderStatus = orderStatus;

  const response = await apiClient.get(GET_ORDERS, {
    headers,
  });
  return response.data;
};
export const editOrderStatus = ({ OrderId, OrderStatus }) =>
  apiClient.put(
    PUT_ORDER_STATUS,
    {},
    {
      headers: {
        OrderId,
        OrderStatus,
      },
    }
  ).then((response) => response.data);

//////////////////////   DASHBOARD SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const getAllUsers = () =>
  apiClient.get(GET_ALL_USERS);

export const getMetrics = (dateRange) =>
  apiClient.get(GET_METRICS, {
    headers: {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    },
  });

export const getSellingProducts = (dateRange) =>
  apiClient.get(GET_SELLING_PRODUCTS, {
    headers: {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    },
  });

export const getRecentOrders = (dateRange) =>
  apiClient.get(GET_RECENT_ORDERS, {
    headers: {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    },
  });

export const getTopCustomers = (dateRange) =>
  apiClient.get(GET_TOP_CUSTOMERS, {
    headers: {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    },
    
  });

export const getSummeryChart = (dateRange) =>
  apiClient.get(GET_SUMMERY_CHART, {
    headers: {
      fromDate: dateRange.fromDate,
      toDate: dateRange.toDate,
    },
  });

//////////////////////   ADVERTISEMENT SECTION ⚠️⚠️⚠️⚠️⚠️⚠️   ////////////////////////////

export const addAdvertisement = (advertisementDetails) =>
  apiClient.post(POST_ADVERTISEMENT, advertisementDetails).then((res) => res.data);

export const getAdvertisement = () =>
  apiClient.get(GET_ADVERTISEMENT).then((res) => res.data);
