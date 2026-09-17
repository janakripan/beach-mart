export const normalizeGuestAddress = (address) => {
  if (!address) return null;

  const parts = [
    address.UserName && `Name: ${address.UserName}`,
    address.Email && `Email: ${address.Email}`,
    address.PhoneNumber && `Phone: ${address.PhoneNumber}`,
    address.Address && `Address: ${address.Address}`,
    address.LandMark && `Landmark: ${address.LandMark}`,
    address.City && `City: ${address.City}`,
    address.District && `District: ${address.District}`,
    address.PinCode && `Pincode: ${address.PinCode}`,
  ];

  return parts.filter(Boolean).join(",");
};
