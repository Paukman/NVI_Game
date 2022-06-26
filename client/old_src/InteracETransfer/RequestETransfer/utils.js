import api, { accountsBaseUrl, etransfersBaseUrl } from "api";
import { filterCAD } from "utils";
import { systemErrorAlert } from "Common/ModalProvider";
import {
  invalidEtransferProfile,
  noRecipients,
  noEligibleAccounts,
  limitsFailed
} from "./alerts";

export const isRequestETransferEligible = async (
  modal,
  setIsProfileEnabled,
  history
) => {
  try {
    const profile = await api.get(`${etransfersBaseUrl}/profile`);
    if (profile.data.enabled && profile.data.customerEnabledForMoneyRequests) {
      return setIsProfileEnabled(true);
    }
    // if no interac profile
    return modal.show(invalidEtransferProfile(history, modal.hide));
  } catch {
    return modal.show(systemErrorAlert(history, modal.hide));
  }
};

export const setRequestETransferFormData = async (
  setFormData,
  setShowForm,
  history,
  modal,
  accountHolderFullName
) => {
  try {
    const requests = await Promise.all([
      api.get(`${etransfersBaseUrl}/recipients`),
      api.get(
        `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`
      ),
      api.get(
        `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`
      )
    ]);
    const recipientsArray = requests[0].data;
    const eligibleAccounts = requests[1].data;
    const limits = requests[2].data;

    const { requestMoneyLimits } = limits.limits;
    const { totalOutstandingMoneyRequests } = limits.accumulatedAmount;

    if (eligibleAccounts.length < 1) {
      modal.show(noEligibleAccounts(history, modal.hide));
      return eligibleAccounts;
    }
    if (recipientsArray.length === 0) {
      modal.show(noRecipients(history, modal.hide));
      return recipientsArray;
    }
    if (
      totalOutstandingMoneyRequests >= requestMoneyLimits.maxOutstandingRequests
    ) {
      modal.show(limitsFailed(history, modal.hide));
      return [];
    }
    setFormData({
      depositAccounts: recipientsArray,
      withdrawalAccounts: filterCAD(eligibleAccounts),
      interacLimits: limits,
      loading: false,
      legalName: accountHolderFullName
    });
    setShowForm(true);
    return true;
  } catch (e) {
    setShowForm(false);
    modal.show(systemErrorAlert(history, modal.hide));
    return false;
  }
};
