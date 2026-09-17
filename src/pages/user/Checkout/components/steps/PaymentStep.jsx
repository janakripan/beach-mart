import React, { useState } from "react";
import StepHeader from "../shared/StepHeader";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useBuyNowPayment, useCreateCheckoutSession } from "../../../../api/hooks/usePayment";
import PaymentRightPanel from "../payment/PaymentRightPanel";
import { usePostOrder } from "../../../../api/hooks/useOrders";
import { buildOrderPayload } from "../../../../utils/buildOrderPayload";
import { useCartStore } from "../../../Cart/store/CartStore";
import { useAuthStore } from "../../../Auth/store/AuthStore";
import { useCheckoutStore } from "../../store/CheckoutStore";
import { useNavigate } from "react-router-dom";
import { useClearCart } from "../../../../api/hooks/useCart";
import { buildOrderBuyNowPayload } from "../../../../utils/buildOrderBuyNowPayload";
import { normalizeGuestAddress } from "../../../../utils/normalizeGuestAddress";
import { useMessage } from "../../../../components/MessageBox/useMessage";


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

  const navigate = useNavigate()
  const stripe = useStripe();
  const elements = useElements();

  // ✅ Zustand subscriptions (YES, this is the correct way)
  const mode = useCheckoutStore((s) => s.mode);
  const checkoutItems = useCheckoutStore((s) => s.items);
  const cartItems = useCartStore((s) => s.items);

  const items = mode === "buy_now" ? checkoutItems : cartItems;

  const item = items[0];
  const clearCart = useCartStore((s) => s.clearCart);
  const markCompleted = useCheckoutStore((s) => s.markCompleted)
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  // const addressId = useCheckoutStore(
  //   (s) => s.stepData.address?.addressId
  // );

  const addressStep = useCheckoutStore((s) => s.stepData.address);

  const addressId = addressStep?.addressId ?? -1;
  const addressData = addressStep?.addressSnapshot ?? null;

  const isGuest = user?.isGuest === true;

  const email = isGuest
    ? addressStep?.addressSnapshot?.Email
    : user?.Email;

  const normalizedAddressData = isGuest
    ? normalizeGuestAddress(addressStep.addressSnapshot)
    : null;
  // API hooks
  const { mutateAsync: postOrder, isPending } = usePostOrder();
  const { mutateAsync: createSession } = useCreateCheckoutSession();
  const { mutate: clearCartMutation, isPaused: clearingCart } = useClearCart();
  const { mutateAsync: buyNowPayment } = useBuyNowPayment();

  const handlePay = async () => {
    if (isPaying) return;

    if (isGuest && !normalizedAddressData) {
      message.info("Please add a delivery address");
      return;
    }

    if (!items || items.length === 0) return;
    setIsPaying(true);

    try {
      /* =====================================================
         BUY NOW FLOW
         ===================================================== */
      if (mode === "buy_now") {
        // 1️⃣ ALWAYS call Buy Now API first
        const {
          clientSecret,
          paymentIntentId,
          totalAmount,
          cartItems,
        } = await buyNowPayment({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.qty,
          paymode: selectedMethod === "card" ? "STRIPE" : "COD",
        });

        // ---------- CARD ----------
        if (selectedMethod === "card") {
          const result = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
              },
            }
          );

          if (result.error) throw result.error;
          if (result.paymentIntent.status !== "succeeded") {
            throw new Error("Payment not successful");
          }

          const payload = buildOrderBuyNowPayload({
            userName: user.FullName,
            email,
            addressId,
            addresd_Data: isGuest ? normalizedAddressData : null,
            paymentMode: "CARD",
            paymentReference:
              result.paymentIntent.id || paymentIntentId,
            mode: "BUY_NOW",
            item,
            totalAmount, // ✅ BACKEND VALUE
          });

          const orderResponse = await postOrder(payload);

          markCompleted();

          navigate("/purchase-success", {
            replace: true,
            state: {
              orderId: orderResponse?.data?.orderId,
            },
          });

          return;
        }

        // ---------- COD ----------
        if (selectedMethod === "cod") {
          const payload = buildOrderBuyNowPayload({
            userName: user.FullName,
            email,
            addressId,
            addresd_Data: isGuest ? normalizedAddressData : null,
            paymentMode: "COD",
            paymentReference: null,
            mode: "BUY_NOW",
            item,
            totalAmount, // ✅ SAME VALUE AS CARD
          });

          const orderResponse = await postOrder(payload);


          markCompleted();

          navigate("/purchase-success", {
            replace: true,
            state: {
              orderId: orderResponse?.data?.orderId,
            },
          });

          return;
        }
      }

      /* =====================================================
         CART FLOW
         ===================================================== */
      if (mode !== "buy_now") {
        // ---------- CARD ----------
        if (selectedMethod === "card") {
          const { clientSecret } = await createSession();

          const result = await stripe.confirmCardPayment(
            clientSecret,
            {
              payment_method: {
                card: elements.getElement(CardElement),
              },
            }
          );

          if (result.error) {
            message.error(result.error.message);
            return;
          }

          if (result.paymentIntent.status !== "succeeded") {
            throw new Error("Payment not successful");
          }

          const payload = buildOrderPayload({
            userName: user.FullName,
            email,
            addressId,
            addresd_Data: isGuest ? normalizedAddressData : null,
            paymentMode: "CARD",
            paymentReference: result.paymentIntent.id,
          });

          const orderResponse = await postOrder(payload);

          clearCart();
          clearCartMutation();
          markCompleted();

          navigate("/purchase-success", {
            replace: true,
            state: {
              orderId: orderResponse?.data?.orderId,
            },
          });

          return;
        }

        // ---------- COD ----------
        if (selectedMethod === "cod") {
          await new Promise((r) => setTimeout(r, 1000));

          const payload = buildOrderPayload({
            userName: user.FullName,
            email,
            addressId,
            addresd_Data: isGuest ? normalizedAddressData : null,
            paymentMode: "COD",
            paymentReference: null,
          });

          const orderResponse = await postOrder(payload);
          console.log(orderResponse)

          clearCart();
          clearCartMutation();
          markCompleted();

          navigate("/purchase-success", {
            replace: true,
            state: {
              orderId: orderResponse?.data?.orderId,
            },
          });

          return;
        }
      }
    } catch (err) {
      console.error("Payment failed:", err);
      message.error(err?.message || "Payment failed. Please try again.");
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
