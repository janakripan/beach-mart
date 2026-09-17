import { formatShippingAddress } from "./formatShippingAddress";
import { parseShippingAddress } from "./parseShippingAddress";


export const normalizeOrders = (rawOrders = []) => {
  if (!Array.isArray(rawOrders)) return [];

  return rawOrders.map((order) => {
    const rawItems = order.orderDetails || order.OrderDetails || [];
    const items = rawItems.map(item => ({
      ...item,
      productName: item.productName || item.ProductName || "Unknown product",
      primaryImageUrl: item.primaryImageUrl || item.PrimaryImageUrl || "",
      sizeLabel: item.sizeLabel || item.SizeLabel || null,
      price: item.price || item.Price || 0,
      quantity: item.quantity || item.Quantity || 0
    }));
    const firstItem = items[0];
    const shippingAddress = parseShippingAddress(order.shippingAddress || order.ShippingAddress);
    return {
      id: order.transactionId || order.TransactionId,
      orderReference: `${order.orderId || order.OrderId}`,
      orderDate: formatDate(order.orderDate || order.OrderDate),
        shippingAddress,              // structured object
      shippingAddressText: shippingAddress
        ? formatShippingAddress(shippingAddress)
        : null,
      
      paymentMode: order.paymentMode || order.PaymentMode,
      items, 
      manifest: `MANIFEST | ${items.length} ITEM${items.length !== 1 ? "S" : ""}`,

      mainProduct: {
        name: firstItem?.productName ?? "Unknown product",
        image: firstItem?.primaryImageUrl ?? "",
        subtitle: firstItem?.sizeLabel ? `${firstItem.sizeLabel}` : null,
      },

      additionalItems: items.slice(1).map(
        (item) => item.primaryImageUrl
      ),

      additionalCount: Math.max(items.length - 1, 0),

      total: `${order.orderAmount || order.OrderAmount}`,

      status: (order.orderStatus || order.OrderStatus || "").toUpperCase(),
      statusType: mapStatusType(order.orderStatus || order.OrderStatus || ""),
      
      dispatchDate:
        (order.orderStatus || order.OrderStatus || "").toLowerCase() === "shipped" ? "DISPATCHED" : null,

      arrivalLabel:
        (order.orderStatus || order.OrderStatus || "").toLowerCase() === "out for delivery" ? "ARRIVAL" : null,

      estimatedDelivery:
        (order.orderStatus || order.OrderStatus || "").toLowerCase() === "delivered"
          ? null
          : "ESTIMATED DELIVERY",

      deliveredDate:
        (order.orderStatus || order.OrderStatus || "").toLowerCase() === "delivered"
          ? "DELIVERED"
          : null,
    };
  });
};

const mapStatusType = (status = "") => {
  const s = status.toLowerCase();

  if (s === "shipped") return "transit";
  if (s === "out for delivery") return "delivery";
  if (s === "delivered") return "delivered";
  if (s === "cancelled") return "cancelled";

  return "pending";
};

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
