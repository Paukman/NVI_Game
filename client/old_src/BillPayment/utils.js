import { billPaymentErrors } from "utils/MessageCatalog";
import { amountRange, amountExchangeRate } from "./constants";

export const errorMessages = {
  balanceLimit: billPaymentErrors.MSG_RBBP_002B,
  requiredFromAccount: billPaymentErrors.MSG_RBBP_005,
  requiredToAccount: billPaymentErrors.MSG_RBBP_006,
  requiredAmount: billPaymentErrors.MSG_RBBP_007,
  ensureValidDate: billPaymentErrors.MSG_RBBP_008,
  requiredFrequency: billPaymentErrors.MSG_RBBP_009B,
  requiredNoOfPayments: billPaymentErrors.MSG_RBBP_009C,
  ensureIsNumber: billPaymentErrors.MSG_RBBP_009C,
  ensureNumberIsInRange: billPaymentErrors.MSG_RBBP_009C,
  requiredMinAmount: billPaymentErrors.MSG_RBBP_035B(amountRange.min),
  requiredMaxAmount: billPaymentErrors.MSG_RBBP_035C(amountRange.max),
  requiredMinExchangeAmount: billPaymentErrors.MSG_RBBP_035B(
    amountExchangeRate.min
  ),
  requiredMaxExchangeAmount: billPaymentErrors.MSG_RBBP_035C(
    amountExchangeRate.max
  ),
  requiredMaxExchangeAmountVIP: billPaymentErrors.MSG_RBBP_035C(
    amountExchangeRate.maxVIP
  ),
  ensureDateIsNotTooFarInFuture: billPaymentErrors.MSG_RBBP_040,
  ensureRecurringDateIsNotTooFarOut: maxDate =>
    billPaymentErrors.MSG_RBBP_040B(maxDate),
  ensureDateIsNotInThePast: billPaymentErrors.MSG_RBBP_041,
  ensureDateIsNotAfterEndDate: billPaymentErrors.MSG_RBBP_041B,
  ensureDateIsNotBeforeStartDate: billPaymentErrors.MSG_RBBP_041C
};
