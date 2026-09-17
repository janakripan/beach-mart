import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentStep from "./steps/PaymentStep";


const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const StripePaymentRoute = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentStep />
    </Elements>
  );
};

export default StripePaymentRoute;
