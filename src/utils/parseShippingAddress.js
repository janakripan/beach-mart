export const parseShippingAddress = (address) => {
  if (!address) return null;

  try {
    return JSON.parse(address);
  } catch {
    return null;
  }
};