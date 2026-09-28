import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateOrderStatus } from "../../../api/admin/service";
import { MapPin } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ConfirmOrder = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const name = searchParams.get("name");
  const number = searchParams.get("number");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError("There is no Order with this id");
    }
  }, [orderId]);

  const handleConfirmOrder = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    setError("");

    try {
      await updateOrderStatus(orderId, "Delivered");
      setSuccess(true);
      toast.success("Order confirmed successfully!");

      // Send WhatsApp message to customer
      if (number) {
        let formattedNumber = number;
        // remove + if encoded incorrectly or already there
        formattedNumber = formattedNumber.replace("+", "");
        
        const message = `🛍️ ORDER DELIVERED — #${orderId}\n🏪 BEACH CIRCLE MINI MART LLC\n\nHi ${name},\nYour order has been delivered successfully. Thank you for shopping with us!\n\n🌐 beachmarts.com\n📞 Support: +971561999705`;
        
        // Timeout to let the user see the success message
        setTimeout(() => {
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, "_blank");
        }, 1500);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to confirm order. Please try again.");
      toast.error("Failed to confirm order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 font-sans">
      <Toaster position="top-center" />
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Animated Icon */}
        <div className="relative mb-8 w-32 h-32 flex items-center justify-center">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 -20 100 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Box Base */}
            <path
              d="M20 50h60v35a5 5 0 0 1-5 5H25a5 5 0 0 1-5-5V50z"
              fill="#F9A826"
              stroke="#0B1A3A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Box Flaps */}
            <path
              d="M15 50h70v-8a2 2 0 0 0-2-2H17a2 2 0 0 0-2 2v8z"
              fill="#0B1A3A"
            />
            <path
              d="M50 50v35"
              stroke="#0B1A3A"
              strokeWidth="4"
            />
            {/* Box Label */}
            <rect
              x="25"
              y="58"
              width="15"
              height="10"
              fill="#FF6B6B"
              rx="2"
            />
            {/* Map Pin */}
            <path
              className="animate-bounce"
              d="M50 15c-8.284 0-15 6.716-15 15 0 11.25 15 25 15 25s15-13.75 15-25c0-8.284-6.716-15-15-15zm0 21.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"
              fill="#FF6B6B"
              stroke="#0B1A3A"
              strokeWidth="4"
            />
          </svg>
        </div>

        {error ? (
          <div className="text-sm font-medium text-red-500 mb-6">{error}</div>
        ) : success ? (
          <div className="text-sm font-medium text-green-600 mb-6">
            Order confirmed successfully!
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-800 mb-6 max-w-xs leading-relaxed">
            Please review the details and confirm the order for <br />
            <span className="text-[#FF6B6B] text-base font-bold uppercase">{name || "Customer"}</span> .
          </p>
        )}

        <button
          onClick={handleConfirmOrder}
          disabled={isLoading || !orderId || success}
          className="w-full max-w-[300px] bg-[#1A233A] hover:bg-[#111827] text-white py-3.5 px-6 rounded-lg font-semibold text-[15px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? "Confirming..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
