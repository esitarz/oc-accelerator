import { Button } from "@chakra-ui/react";
import { useMemo } from "react";
import { PAYMENT_PROVIDER, PAYMENT_PROVIDERS } from "../../../../constants/payment.constants";
import { BlueSnap } from "../payment/PaymentBlueSnap";
import { CardConnect } from "../payment/PaymentCardConnect";
import { PayPal } from "../payment/PaymentPayPal";
import { Stripe } from "../payment/PaymentStripe";


type CartPaymentPanelProps = {
  submitOrder: () => void;
  submitting: boolean;
};

const PaymentMapper = (provider: PAYMENT_PROVIDERS) => {
  switch (provider) {
    case PAYMENT_PROVIDERS.STRIPE:
      return <Stripe />;
    case PAYMENT_PROVIDERS.CARD_CONNECT:
      return <CardConnect />;
    case PAYMENT_PROVIDERS.BLUESNAP:
      return <BlueSnap />;
    case PAYMENT_PROVIDERS.PAYPAL:
      return <PayPal />;
    default:
      null;
  }
};

export const CartPaymentPanel = ({
  submitOrder,
  submitting,
}: CartPaymentPanelProps) => {
  const PaymentElement = useMemo(() => {
    return PaymentMapper(PAYMENT_PROVIDER);
  }, []);

  return (
    <>
      {PaymentElement}

      <Button
        alignSelf="flex-end"
        onClick={submitOrder}
        mt={6}
        isDisabled={submitting}
      >
        {submitting ? "Submitting" : "Submit Order"}
      </Button>
    </>
  );
};
