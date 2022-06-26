import { formatCurrency } from "utils";
import { requestETransferErrors } from "utils/MessageCatalog";

const validateAmountRange = (value, interacLimits) => {
  const limits = interacLimits.limits.requestMoneyLimits;
  const minimum = 0.01;
  const maximum = limits.maxRequestOutgoingAmount;
  if (value < minimum || value > maximum) {
    return requestETransferErrors.MSG_RBET_012(
      formatCurrency(minimum),
      formatCurrency(maximum)
    );
  }
  return value;
};

export { validateAmountRange };
