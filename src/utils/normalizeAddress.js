export const normalizeAddress = (raw) => {
  let details = {};

  try {
    details = JSON.parse(raw.AddressDetails || "{}");
  } catch {
    details = {};
  }

  const addressParts = [
    details.Address,
    details.LandMark,
    details.District,
    details.City,
  ].filter(Boolean);

  return {
    id: raw.AddressId,
    isDefault: Boolean(raw.IsDefault),

    name: details.UserName || "Unnamed",
    phone: details.PhoneNumber || "",

    type: details.AddressLabel?.toUpperCase() || "OTHER",

    address: addressParts.length
      ? `${addressParts.join(", ")}${details.PinCode ? " - " + details.PinCode : ""}`
      : "Address not available",

    rawDetails: details,
  };
};
