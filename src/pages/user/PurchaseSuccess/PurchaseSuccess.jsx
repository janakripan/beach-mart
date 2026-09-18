import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PurchaseSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(6);

  const orderId = location.state?.orderId || "UNKNOWN";

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/", { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-poppins px-4 text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Purchase Successful!
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for your order. We have received your order <span className="font-semibold text-gray-800">#{orderId}</span> and will process it shortly.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full max-w-sm mb-6">
        <p className="text-gray-600">
          Redirecting to home in <span className="font-bold text-primary text-xl">{countdown}</span> seconds...
        </p>
      </div>

      <Link
        to="/"
        className="px-8 py-3 bg-primary text-white font-medium rounded-xl hover:bg-secondary transition"
      >
        Go to Home manually
      </Link>
    </div>
  );
};

export default PurchaseSuccess;
