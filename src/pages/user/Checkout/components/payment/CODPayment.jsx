const CODPayment = ({ onPay, isPaying }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center">
      <p className="text-sm text-gray-600 mb-4">
        Pay in cash when your order is delivered.
      </p>

      <button
        onClick={onPay}
        disabled={isPaying}
        className={`w-full py-3 rounded-xl text-white flex items-center justify-center
    ${isPaying ? "bg-gray-400 cursor-not-allowed" : "bg-black"}
  `}
      >
        {isPaying ? (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
};
export default CODPayment
