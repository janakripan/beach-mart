export const normalizeAddress = (raw) => {
  let details = {};

  try {
    details = JSON.parse(raw.AddressDetails || "{}");
  } catch {
    details = {};
  }

  const addressParts = [
    details.Address || details.address,
    details.LandMark || details.landMark || details.landmark,
    details.District || details.district,
    details.City || details.city,
  ].filter(Boolean);

  return {
    id: raw.AddressId,
    isDefault: Boolean(raw.IsDefault),

    name: details.UserName || details.userName || details.name || "Unnamed",
    phone: details.PhoneNumber || details.phoneNumber || details.phone || "",

    type: (details.AddressLabel || details.addressLabel || "").toUpperCase() || "OTHER",

    address: addressParts.length
      ? `${addressParts.join(", ")}${(details.PinCode || details.pinCode || details.pincode) ? " - " + (details.PinCode || details.pinCode || details.pincode) : ""}`
      : "Address not available",

    rawDetails: details,
  };
};
