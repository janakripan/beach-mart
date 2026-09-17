import CardPayment from "./CardPayment";
import CODPayment from "./CODPayment";
import PaypalPayment from "./PaypalPayment";
import TabbyPayment from "./TabbyPayment";

const PaymentRightPanel = ({ method, onPay, isPaying }) => {
  switch (method) {
    case "card":
      return <CardPayment onPay={onPay} isPaying={isPaying} />;

    case "paypal":
      return <PaypalPayment />;

    case "tabby":
      return <TabbyPayment />;

    case "cod":
      return <CODPayment onPay={onPay} isPaying={isPaying} />;

    default:
      return null;
  }
};

export default PaymentRightPanel
