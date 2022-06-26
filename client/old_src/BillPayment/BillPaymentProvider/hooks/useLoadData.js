import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";
import { eTransferErrors } from "utils/MessageCatalog";
import {
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY
} from "./constants";
import { ON_CHANGE } from "./useOneTimeReducer";
import useNonExistingPayee from "./useNonExistingPayee";
import useNoPayees from "./useNoPayees";
import useNoEligibleAccounts from "./useNoEligibleAccounts";
import { loadAccountAndPayee } from "./utils";

const useLoadData = (updateStateOneTime, updateStateRecurring) => {
  const isMounted = useIsMounted();
  const location = useLocation();
  const { showNonExistingPayeeAlert } = useNonExistingPayee();
  const { showNoPayeesAlert } = useNoPayees();
  const { showNoEligibleAccountsAlert } = useNoEligibleAccounts();

  useEffect(() => {
    const fetchData = async () => {
      if (!isMounted()) {
        return undefined;
      }
      updateStateOneTime({ type: LOADING_DATA });
      updateStateRecurring({ type: LOADING_DATA });
      try {
        const {
          billPayeesData,
          dataOneTime,
          dataRecurring
        } = await loadAccountAndPayee();

        if (
          dataOneTime?.fromBillAccounts?.length === 0 ||
          dataRecurring?.fromBillAccounts?.length === 0
        ) {
          showNoEligibleAccountsAlert();
        } else if (!billPayeesData?.length) {
          if (location.to) {
            showNonExistingPayeeAlert(location.to);
          } else {
            showNoPayeesAlert();
          }
        }

        if (!isMounted()) {
          return undefined;
        }
        updateStateOneTime({ type: LOADED_DATA, data: dataOneTime });
        updateStateRecurring({ type: LOADED_DATA, data: dataRecurring });
      } catch (e) {
        if (isMounted()) {
          updateStateOneTime({ type: LOADING_DATA_FAILED });
          updateStateRecurring({ type: LOADING_DATA_FAILED });
        }
      }
      return null;
    };
    fetchData();
  }, [updateStateOneTime, updateStateRecurring, isMounted, showNoPayeesAlert]);

  const handleAddPayee = async payeeData => {
    if (!isMounted()) {
      return undefined;
    }
    try {
      const { dataOneTime, dataRecurring } = await loadAccountAndPayee();
      if (!isMounted()) {
        return undefined;
      }
      updateStateOneTime({ type: LOADED_DATA, data: dataOneTime });
      updateStateRecurring({ type: LOADED_DATA, data: dataRecurring });
      const { payeeName, account, payeeNickname } = payeeData;
      const payee = dataOneTime.billPayees.filter(
        item =>
          item.payeeName === payeeName &&
          item.payeeCustomerReference === account &&
          item.payeeNickname === payeeNickname
      )[0];
      if (payee) {
        updateStateOneTime({
          type: ON_CHANGE,
          data: {
            name: "to",
            value: payee.billPayeeId
          }
        });
        updateStateRecurring({
          type: ON_CHANGE,
          data: {
            name: "to",
            value: payee.billPayeeId
          }
        });
        updateStateOneTime({
          type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
          data: { name: "to", value: payee.billPayeeId }
        });
        updateStateRecurring({
          type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
          data: { name: "to", value: payee.billPayeeId }
        });
      }
    } catch (e) {
      if (isMounted()) {
        updateStateOneTime({
          type: LOADING_DATA_FAILED,
          data: eTransferErrors.MSG_REBAS_000
        });
        updateStateRecurring({
          type: LOADING_DATA_FAILED,
          data: eTransferErrors.MSG_REBAS_000
        });
      }
    }
    return null;
  };
  return {
    handleAddPayee
  };
};

export default useLoadData;
