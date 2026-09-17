export const buildOrderBuyNowPayload = ({
  userName,
  email,
  addressId,
  addresd_Data,
  paymentMode,
  paymentReference = null,
  item,
  totalAmount,
}) => {
  if (!item) {
    throw new Error("Buy Now item missing");
  }

  // 🔐 Address validation
  const isGuest = addressId === -1;

  if (isGuest && !addresd_Data) {
    throw new Error("Guest order requires address data");
  }

  if (!isGuest && addresd_Data) {
    throw new Error("Authenticated order must not include address data");
  }
    if (!email) {
    throw new Error("Email is required");
  }


  return {
    userName : userName || "guest",
    email: email,
    orderDate: new Date().toISOString(),
    orderAmount: Number(totalAmount),

    paymentMode,
    paymentReference,

    addressId,
    addresd_Data: isGuest ? addresd_Data : null,

    orderDetails: [
      {
        sI_No: 1,
        productId: item.productId,
        varientID: item.variantId ?? 0,
        productName: item.name,
        quantity: Number(item.qty),
        price: Number(item.price),
        totalAmount: Number(item.price) * Number(item.qty),
      },
    ],
  };
};
