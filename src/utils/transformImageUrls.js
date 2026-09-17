// Helper function to transform the Imgurl keys to imgurl
export const transformImageUrls = (dataArray) => {
  return dataArray.map((item) => {
    const transformedItem = {};

    // Loop through each property in the item
    Object.keys(item).forEach((key) => {
      // If the key starts with 'Imgurl', replace it with 'imgurl'
      if (key.startsWith("Imgurl")) {
        const newKey = key.replace("Imgurl", "imgurl");
        transformedItem[newKey] = item[key];
      } else {
        // Keep other properties as is
        transformedItem[key] = item[key];
      }
    });

    return transformedItem;
  });
};
