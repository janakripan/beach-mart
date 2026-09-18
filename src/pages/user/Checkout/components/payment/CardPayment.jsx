import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const CardPayment = ({ onPay, isPaying }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardComplete, setIsCardComplete] = useState(false);

  return (
    <div className="bg-gray-50 rounded-2xl p-4 border">
      <label className="text-xs font-semibold mb-2 block">
        Card Details
      </label>

      <CardElement
        options={{
          hidePostalCode: true,
          style: { base: { fontSize: "14px", color: "#000" } },
        }}
        onChange={(e) => {
          setIsCardComplete(e.complete);
        }}
      />

      <button
        disabled={!stripe || !isCardComplete || isPaying}
        onClick={onPay}
        className={`w-full mt-4 py-3 rounded-xl text-white flex items-center justify-center
          ${
            !stripe || !isCardComplete || isPaying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-secondary transition"
          }
        `}
      >
        {isPaying ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Pay Now"
        )}
      </button>
    </div>
  );
};

export default CardPayment;
