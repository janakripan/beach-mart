import React, { useState } from "react";
import StepHeader from "../shared/StepHeader";
import PaymentRightPanel from "../payment/PaymentRightPanel";
import { useAuthStore } from "../../../../Auth/store/AuthStore";
import { useCheckoutStore } from "../../store/CheckoutStore";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../../../../components/admin/MessageBox/useMessage";

const PAYMENT_METHODS = [
  { id: "card", label: "Card" },
  { id: "paypal", label: "PayPal" },
  { id: "tabby", label: "Tabby" },
  { id: "cod", label: "Cash on Delivery" },
];

const PaymentStep = () => {
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [isPaying, setIsPaying] = useState(false);
  const message = useMessage();
  const navigate = useNavigate();

  const markCompleted = useCheckoutStore((s) => s.markCompleted);
  const addressStep = useCheckoutStore((s) => s.stepData.address);
  const addressData = addressStep?.addressSnapshot ?? null;

  const handlePay = async () => {
    if (isPaying) return;

    if (!addressData) {
      message.info("Please add a delivery address");
      return;
    }

    setIsPaying(true);

    try {
      // Simulate network request for payment/order creation
      await new Promise((r) => setTimeout(r, 1500));
      
      message.success("Payment processed successfully with static data!");
      
      markCompleted();
      navigate("/purchase-success", {
        replace: true,
        state: {
          orderId: "DUMMY-ORDER-" + Math.floor(Math.random() * 1000000),
        },
      });

    } catch (err) {
      console.error("Payment failed:", err);
      message.error("Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };



  return (
    <div>
      <StepHeader name="Payment Options" />

      <div className="w-full max-w-4xl bg-white border rounded-3xl p-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div className="space-y-4">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`w-full p-4 rounded-full border ${selectedMethod === m.id
                  ? "bg-gray-50 border-transparent"
                  : "border-gray-200"
                  }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* RIGHT */}
          <PaymentRightPanel method={selectedMethod} onPay={handlePay} isPaying={isPaying} />
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
