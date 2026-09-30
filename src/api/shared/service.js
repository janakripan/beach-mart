import apiClient from "../apiClient";
import {
  GET_BANNER,
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_VARIANT,
  GET_HOME_CATEGORIES,
} from "./endpoint";

export const getBanner = () => apiClient.get(GET_BANNER).then((res) => res.data.data);

export const getProducts = async ({
  page = 1,
  pageSize = 0,
  productID = 0,
  productName = "",
  categoryIDs = [],
} = {}) => {
  const body = {
    pageNo: page,
    pageSize,
    productID,
    productName,
    categoryIDs: categoryIDs.length ? categoryIDs : [0]
  };

  console.log("FIRE GET_PRODUCTS POST", GET_PRODUCTS, body);
  const response = await apiClient.post(GET_PRODUCTS, body);
  
  // Normalize the API response to PascalCase so the frontend components don't break
  if (response.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map(p => ({
      ...p,
      ProductID: p.productID !== undefined ? p.productID : p.ProductID,
      ProductName: p.productName !== undefined ? p.productName : p.ProductName,
      Description: p.description !== undefined ? p.description : p.Description,
      Categorie: p.categorie !== undefined ? p.categorie : p.Categorie,
      Price: p.price !== undefined ? p.price : p.Price,
      Discount: p.discount !== undefined ? p.discount : p.Discount,
      DiscMode: p.discMode !== undefined ? p.discMode : p.DiscMode,
      IsCustomizable: p.isCustomizable !== undefined ? p.isCustomizable : p.IsCustomizable,
      ImageUrl1: p.imageUrl1 !== undefined ? p.imageUrl1 : p.ImageUrl1,
      ImageUrl2: p.imageUrl2 !== undefined ? p.imageUrl2 : p.ImageUrl2,
      ImageUrl3: p.imageUrl3 !== undefined ? p.imageUrl3 : p.ImageUrl3,
      ImageUrl4: p.imageUrl4 !== undefined ? p.imageUrl4 : p.ImageUrl4,
      ImageUrl5: p.imageUrl5 !== undefined ? p.imageUrl5 : p.ImageUrl5,
      ImageUrl6: p.imageUrl6 !== undefined ? p.imageUrl6 : p.ImageUrl6,
      IsActive: p.isActive !== undefined ? p.isActive : p.IsActive,
      SecondaryDescription: p.secondaryDescription !== undefined ? p.secondaryDescription : p.SecondaryDescription,
      SecondaryName: p.secondaryName !== undefined ? p.secondaryName : p.SecondaryName,
      OnHand: p.onHand !== undefined ? p.onHand : p.OnHand,
      ProductVariants: p.productVariants !== undefined ? p.productVariants : p.ProductVariants,
    }));
  }

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

export const getHomeCategories = async () => {
  const response = await apiClient.get(GET_HOME_CATEGORIES);
  console.log(response.data);
  
  return response.data;
};
