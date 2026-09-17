import apiClient from "../../apiClient";

export const addressService = {
  getAddresses: async () => {
    const res = await apiClient.get("/getUserAddress");
    return res.data;
  },

  addAddress: async (payload) => {
    const res = await apiClient.post("/postUserAddress", payload);
    return res.data;
  },
  updateAddress: async ({ addressId, data }) => {
    if (!addressId) {
      throw new Error("addressId is required to update address");
    }

    const res = await apiClient.put(
      "/putUserAddress",
      data,
      {
        headers: {
          AddressId: addressId,
        },
      }
    );

    return res.data;
  },

  setDefaultAddress: async (addressId) => {
    if (!addressId) {
      throw new Error("addressId is required to set default address");
    }

    const res = await apiClient.put(
      "/putUserAddressDefault",
      null,
      {
        headers: {
          AddressId: addressId,
          IsDefault: true,
        },
      }
    );

    return res.data;
  },
};
