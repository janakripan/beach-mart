import React, { useEffect } from "react";
import { X } from "lucide-react";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl px-2  shadow-2xl animate-modal-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-400 ">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Order {order.orderReference}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {order.orderDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Order Summary */}
          <section className="px-6 py-4 border-b border-gray-400  grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Order Status</p>
              <p className="font-medium text-gray-900">{order.status}</p>
            </div>

            <div>
              <p className="text-gray-400">Payment Method</p>
              <p className="font-medium text-gray-900">
                {order.paymentMode || "COD"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Customer</p>
              <p className="font-medium text-gray-900">
                {order?.shippingAddress?.UserName || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Total Amount</p>
              <p className="font-semibold text-gray-900">{order.total}</p>
            </div>
          </section>

          {/* Shipping Address */}
          {order.shippingAddressText && (
            <section className="px-6 py-4 border-b border-gray-400">
              <p className="text-sm font-medium text-gray-900 mb-2">
                Shipping Address
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {order.shippingAddressText}
              </p>
            </section>
          )}

          {/* Items */}
          <section className="px-6 py-4 space-y-4">
            <p className="text-sm font-medium text-gray-900">
              Items ({order.items.length})
            </p>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start border-b border-gray-400  pb-4 last:border-b-0"
              >
                <img
                  src={item.primaryImageUrl}
                  alt={item.productName}
                  className="w-16 h-20 rounded-md object-cover "
                />

                <div className="grow">
                  <p className="text-sm font-medium text-gray-900">
                    {item.productName}
                  </p>

                  {order.mainProduct.subtitle && (
                    <p className="text-xs text-gray-500">
                      Size: {item.sizeLabel}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    AED {item.price} × {item.quantity}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    AED {item.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-400   flex justify-between items-center">
          <span className="text-sm text-gray-500">Grand Total</span>
          <span className="text-lg font-semibold text-gray-900">
            {order.total}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
