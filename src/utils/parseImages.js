export const parseImages = (images) => {
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
};