import api, { accountsBaseUrl, etransfersBaseUrl } from "api";
import { filterCAD } from "utils";
import { systemErrorAlert } from "Common/ModalProvider";
import {
  noEligibleAccountsAlert,
  dailyLimitReachedAlert,
  weeklyLimitReachedAlert,
  monthlyLimitReachedAlert
} from "./alerts";

// AT this is temp solution so we don't raise modal if there is no profile
// same as the above fetchValidation
export const fetchValidationWithoutModal = (
  setAlertError,
  setFormData,
  setShowForm,
  history,
  handleOk,
  modal
) => {
  Promise.all([
    api.get(`${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`),
    api.get(
      `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`
    )
  ])
    .then(results => {
      const eligibleAccounts = results[0].data;
      const eTransferLimits = results[1].data;
      if (eligibleAccounts.length < 1) {
        setAlertError(noEligibleAccountsAlert(handleOk));
      } else if (eTransferLimits.limits) {
        const { outgoingLimits } = eTransferLimits.limits;
        const { outgoingAmounts } = eTransferLimits.accumulatedAmount;

        if (outgoingAmounts.total24HrAmount >= outgoingLimits.max24HrAmount) {
          setAlertError(dailyLimitReachedAlert(handleOk, outgoingLimits));
        } else if (
          outgoingAmounts.total7DayAmount >= outgoingLimits.max7DayAmount
        ) {
          setAlertError(weeklyLimitReachedAlert(outgoingLimits));
        } else if (
          outgoingAmounts.total30DayAmount >= outgoingLimits.max30DayAmount
        ) {
          setAlertError(monthlyLimitReachedAlert(outgoingLimits));
        }
      }
      setFormData(prevState => ({
        ...prevState,
        withdrawalAccounts: filterCAD(eligibleAccounts),
        interacLimits: eTransferLimits
      }));
      setShowForm(true);
    })
    .catch(() => {
      setShowForm(false);
      modal.show(systemErrorAlert(history, modal.hide));
    });
};
