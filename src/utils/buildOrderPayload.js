import { useCartStore } from "../pages/user/Cart/store/CartStore";

export const buildOrderPayload = ({
  userName,
  email,
  addressId,
  paymentMode,
  addresd_Data,
  paymentReference = null,
}) => {
  const { items, summary } = useCartStore.getState();

  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  // 🔐 Address validation
  const isGuest = addressId === -1;

  if (isGuest && !addresd_Data) {
    throw new Error("Guest order requires address data");
  }

  if (!isGuest && addresd_Data) {
    throw new Error("Authenticated order must not include address data");
  }

  // 🧮 Recalculate total defensively
  const calculatedTotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  // Optional strict check
  if (Math.abs(calculatedTotal - summary.total) > 0.01) {
    throw new Error("Order total mismatch");
  }  if (!email) {
    throw new Error("Email is required");
  }


  return {
    userName : userName || "guest",
    email,
    orderDate: new Date().toISOString(),

    orderAmount: Number(summary.total),

    paymentMode,
    paymentReference,

    addressId,
    addresd_Data: isGuest ? addresd_Data : null,

    orderDetails: items.map((item, index) => ({
      sI_No: index + 1,
      productId: item.productId,
      varientID: item.variantId ?? 0,
      productName: item.name,
      quantity: Number(item.qty),
      price: Number(item.price),
      totalAmount: Number(item.price) * Number(item.qty),
    })),
  };
};
