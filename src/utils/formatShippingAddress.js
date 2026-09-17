export const formatShippingAddress = (addr) => {
  if (!addr) return null;

  return [
    addr.UserName,
    addr.Address,
    addr.LandMark,
    `${addr.City}, ${addr.District}`,
    addr.PinCode,
    `Phone: ${addr.PhoneNumber}`,
    addr.AddressLabel ? `(${addr.AddressLabel})` : null,
  ]
    .filter(Boolean)
    .join(", ");
};
