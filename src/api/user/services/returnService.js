import apiClient from "../../apiClient";

export const returnService = {
  postReturnProducts: async (payload) => {
    const res = await apiClient.post("/postReturnProducts", payload);
    return res.data;
  },

getReturnProducts: async (fromDate, toDate) => {
  const res = await apiClient.get(
    "/getReturnProducts",
    {
      headers: {
        fromDate: fromDate,
        toDate: toDate,
      },
    }
  );

  return res.data;
},


  putReturnProducts: async (returnId, returnStatus)=> {
    const res = await apiClient.put("/putReturnProducts",{
        returnStatus: returnStatus,   // Body
      },
      {
        headers: {
          returnid: returnId,        // Custom header
        },
  })
  return res.data;
  }

};
