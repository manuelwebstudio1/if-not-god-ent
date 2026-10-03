/**
 * Payment integration layer — wire provider SDKs server-side only.
 * Never import secret keys in client components.
 */

export type PaymentInitInput = {
  orderNumber: string;
  amount: number;
  currency: "GHS";
  email: string;
  phone: string;
  method:
    | "MTN_MOMO"
    | "TELECEL_CASH"
    | "AIRTELTIGO"
    | "VISA"
    | "MASTERCARD"
    | "BANK_TRANSFER"
    | "PAYSTACK"
    | "FLUTTERWAVE";
};

export type PaymentInitResult = {
  status: "PENDING" | "REQUIRES_ACTION";
  reference: string;
  authorizationUrl?: string;
  message: string;
};

export async function initializePayment(
  input: PaymentInitInput,
): Promise<PaymentInitResult> {
  const reference = `PAY-${input.orderNumber}`;

  switch (input.method) {
    case "PAYSTACK":
      // await paystack.transaction.initialize({ ... process.env.PAYSTACK_SECRET_KEY })
      return {
        status: "REQUIRES_ACTION",
        reference,
        authorizationUrl: undefined,
        message:
          "Connect PAYSTACK_SECRET_KEY and implement Paystack initialize in src/lib/payments/paystack.ts",
      };
    case "FLUTTERWAVE":
      return {
        status: "REQUIRES_ACTION",
        reference,
        message:
          "Connect FLUTTERWAVE_SECRET_KEY and implement Flutterwave charge API",
      };
    case "MTN_MOMO":
    case "TELECEL_CASH":
    case "AIRTELTIGO":
      return {
        status: "PENDING",
        reference,
        message:
          "Mobile money collections require provider API credentials and customer STK/USSD flow",
      };
    default:
      return {
        status: "PENDING",
        reference,
        message:
          "Order recorded. Complete payment via bank transfer or card gateway when connected.",
      };
  }
}
