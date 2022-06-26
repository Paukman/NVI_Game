import { transferErrors } from "utils/MessageCatalog";

export const errorMessages = {
  balanceLimit: transferErrors.MSG_RBTR_005B,
  requiredFromAccount: transferErrors.MSG_RBTR_016,
  requiredToAccount: transferErrors.MSG_RBTR_016,
  requiredAmount: transferErrors.MSG_RBTR_017,
  requiredMinAmount: transferErrors.MSG_RBTR_018_MIN,
  requiredMaxAmount: transferErrors.MSG_RBTR_018_MAX,
  requiredMinExchangeAmount: transferErrors.MSG_RBTR_018_EXCHNAGE_MIN,
  requiredMaxExchangeAmount: transferErrors.MSG_RBTR_018B_EXCHNAGE_MAX,
  requiredMinRRSPAmount: transferErrors.MSG_RBTR_018_MIN_RRSP,
  ensureValidDate: transferErrors.MSG_RBTR_019,
  requiredFrequency: transferErrors.MSG_RBTR_020,
  requiredNoOfTransfers: transferErrors.MSG_RBTR_021,
  ensureIsNumber: transferErrors.MSG_RBTR_021,
  ensureNumberIsInRange: transferErrors.MSG_RBTR_021B,
  ensureFutureDatedTransferSupported: transferErrors.MSG_RBTR_026,
  ensureRecurringTransferSupported: transferErrors.MSG_RBTR_027,
  ensureDateIsNotTooFarInFuture: transferErrors.MSG_RBTR_034,
  ensureRecurringDateIsNotTooFarOut: maxDate =>
    transferErrors.MSG_RBTR_034B(maxDate),
  ensureDateIsNotInThePast_wPresent: transferErrors.MSG_RBTR_035,
  ensureDateIsNotInThePast: transferErrors.MSG_RBTR_042,
  ensureDateIsNotAfterEndDate: transferErrors.MSG_RBTR_042C,
  ensureDateIsNotBeforeStartDate: transferErrors.MSG_RBTR_042B,
  ensure1Year999TransferLimit: transferErrors.MSG_RBTR_001_UNK
};
