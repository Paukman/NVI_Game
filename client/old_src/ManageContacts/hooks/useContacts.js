import { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";
import useErrorModal from "utils/hooks/useErrorModal";
import api, {
  asyncResolver,
  billPaymentsBaseUrl,
  etransfersBaseUrl,
  payeeBaseUrl
} from "api";
import { menageContacts, modeName } from "globalConstants";
import { manageContactMessage } from "utils/MessageCatalog";
import DataStore from "utils/store";
import { BILL_PAYMENT_PAYEES } from "utils/store/storeSchema";
import { ModalContext } from "Common/ModalProvider";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";

import { getLegalName } from "utils/getLegalName";
import useContactAnalytics, {
  contactType
} from "utils/analytics/useContactAnalytics";
import {
  alertForRecipientSaveSystemError,
  alertForPayeeCreateSystemError,
  alertForPayeeSaveSystemError,
  invalidEtransferProfile
} from "../alerts";
import { NICKNAME_NAME_LENGTH } from "../constants";
import { errorTypes } from "../utils";

const useContacts = () => {
  const [contactsData, setContactsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isProfileEnabled, setIsProfileEnabled] = useState(false);
  const [pageName, setPageName] = useState("");
  const [recipientToHandle, setRecipientToHandle] = useState(null);
  const [payeeToHandle, setPayeeToHandle] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [alertError, setAlertError] = useState(null);
  const [showAutodeposit, setShowAutodeposit] = useState(false);
  const [mode, setMode] = useState(modeName.EDIT_MODE);
  const [approvedCreditorsList, setApprovedCreditorsList] = useState(null);
  const isMounted = useIsMounted();
  const [serverErrors, setServerErrors] = useState({
    account: { type: null }
  });

  const [contacts, setState] = useState({
    pageToReturnTo: "",
    pageName: "",
    isCheckingForAutodeposit: false,
    legalName: ""
  });

  const updateContactState = ({ name, value }) => {
    setState(state => ({
      ...state,
      [name]: value
    }));
  };

  const updatePage = value => {
    setState(state => ({
      ...state,
      pageName: value,
      pageToReturnTo:
        // when returning to initial page, clear pageToReturnTo
        menageContacts.RECIPIENTS || menageContacts.PAYEES
          ? ""
          : state.pageToReturnTo
    }));
  };

  const { post, put } = useApiWithRSA();
  const { show, hide } = useContext(ModalContext);
  const { showErrorModal } = useErrorModal();
  const history = useHistory();
  const displayNoProfileModal = useCallback(() => {
    if (!isProfileEnabled) {
      show(invalidEtransferProfile(history, hide));
    }
  }, [hide, history, isProfileEnabled, show]);
  const contactAnalytics = useContactAnalytics();

  useEffect(() => {
    const fetchContactData = async () => {
      const { recipients, payees, profile } = await asyncResolver([
        {
          fn: async () => api.get(`${etransfersBaseUrl}/recipients`),
          key: "recipients"
        },
        {
          fn: async () => api.get(`${payeeBaseUrl}/payees`),
          key: "payees"
        },
        {
          fn: async () => api.get(`${etransfersBaseUrl}/profile`),
          key: "profile"
        }
      ]);

      if (!isMounted()) {
        return;
      }

      if ([recipients, payees, profile].some(data => !!data.error)) {
        showErrorModal();
        return;
      }

      setContactsData({
        recipients: recipients.result?.data || [],
        payees: payees.result?.data || []
      });

      if (
        profile.result?.data.enabled &&
        profile.result?.data.customerEnabledForMoneyRequests
      ) {
        setIsProfileEnabled(true);
      } else {
        displayNoProfileModal();
      }

      setIsLoading(false);
    };
    if (isLoading) {
      fetchContactData();
    }
  }, [displayNoProfileModal, isLoading, isMounted]);

  const getTransferAuthentication = data => {
    // no need for any of the previous checks. Data will determine
    // what kind of authenticationType will be set
    if (data?.question && data?.answer) {
      return {
        authenticationType: 0,
        question: data.question,
        answer: data.answer
      };
    }
    return {
      authenticationType: 2
    };
  };

  const confirmOnOk = () => {
    setIsAlertShowing(false);
    setAlertError(null);
  };

  const updateRecipient = async data => {
    const formData = {
      registrationName: data.name,
      notificationHandle: data.email,
      transferAuthentication: getTransferAuthentication(data),
      oneTimeRecipient: false
    };
    try {
      setIsPosting(true);
      const result = await put(
        `${etransfersBaseUrl}/recipients/${recipientToHandle.recipientId}`,
        formData
      );
      if (result.status === 200 && isMounted()) {
        setContactsData(null);
        setOpenSnackbar(true);
        setSnackbarMessage(manageContactMessage.MSG_RBET_036D(data.name));
        setIsPosting(false);
        setPageName(menageContacts.RECIPIENTS);
        setRecipientToHandle(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      if (isMounted()) {
        setIsPosting(false);
        if (error) {
          setIsAlertShowing(true);
          setAlertError(alertForRecipientSaveSystemError(confirmOnOk));
        }
      }
    }
  };

  const setLegalName = legalName => {
    setState(state => ({
      ...state,
      legalName
    }));
  };

  const getTransferType = async notificationHandle => {
    try {
      setState(state => ({
        ...state,
        isCheckingForAutodeposit: true,
        legalName: ""
      }));
      const { data: result } = await api.post(`${etransfersBaseUrl}/options`, {
        email: notificationHandle
      });
      const { transferType } = result[0];
      if (transferType === 2 && isMounted()) {
        setShowAutodeposit(true);
      }
      setState(state => ({
        ...state,
        isCheckingForAutodeposit: false,
        legalName: getLegalName(contacts, result[0].customerName)
      }));
      return transferType;
    } catch (e) {
      showErrorModal();
    }
    return null;
  };

  const deriveName = (name, nickname) => {
    return nickname && nickname.length > 0 ? `${name}/${nickname}` : name;
  };

  const filterCreditorsByName = name => {
    return approvedCreditorsList.filter(creditor => creditor.name === name);
  };

  const clearServerError = useCallback(
    errorType => {
      switch (errorType) {
        case errorTypes.INVALID_ACCOUNT:
          setServerErrors(prevErrors => ({
            ...prevErrors,
            account: { type: null }
          }));
          break;
        default:
          break;
      }
    },
    [setServerErrors]
  );

  const handleServerErrors = (
    payeeMode,
    apiError,
    payeeName,
    payeeNickname
  ) => {
    const setErrorBasedOnMode = () => {
      switch (payeeMode) {
        case modeName.CREATE_MODE:
          setAlertError(
            alertForPayeeCreateSystemError(
              confirmOnOk,
              deriveName(payeeName, payeeNickname)
            )
          );
          break;
        case modeName.EDIT_MODE:
          setAlertError(
            alertForPayeeSaveSystemError(
              confirmOnOk,
              deriveName(payeeName, payeeNickname)
            )
          );
          break;
        default:
          break;
      }
    };
    if (apiError?.response?.data?.code) {
      switch (apiError.response.data.code) {
        case "BP0009":
          setServerErrors(prevErrors => ({
            ...prevErrors,
            account: { type: errorTypes.INVALID_ACCOUNT }
          }));
          break;
        default:
          setErrorBasedOnMode();
      }
    } else {
      setErrorBasedOnMode();
    }
  };

  const updatePayee = async data => {
    clearServerError(errorTypes.INVALID_ACCOUNT);
    let result;
    if (mode === modeName.EDIT_MODE) {
      let submitData = {};
      // 1. is account altered?
      if (payeeToHandle.payeeCustomerReference !== data.account) {
        submitData = { payeeCustomerReference: data.account };
      }

      // 2. is Nickname altered and is not default?
      if (data.nickname !== "") {
        if (payeeToHandle.payeeNickname !== data.nickname) {
          // has been altered
          submitData = { ...submitData, payeeNickname: data.nickname };
        }
      } else {
        const defaultName = payeeToHandle.payeeName.substring(
          0,
          NICKNAME_NAME_LENGTH
        );

        submitData = { ...submitData, payeeNickname: defaultName };
      }
      // if they arent updating any fields and simply want to save as is, take them back to payees page
      if (Object.keys(submitData).length === 0) {
        return setPageName(menageContacts.PAYEES);
      }
      try {
        setIsPosting(true);
        result = await put(
          `${payeeBaseUrl}/payees/${payeeToHandle.billPayeeId}`,
          submitData
        );
        DataStore.del(BILL_PAYMENT_PAYEES);

        // Note the confirmationID in the response is available but unused at this time.
        if (result.status === 200 && isMounted()) {
          setContactsData(null);
          setOpenSnackbar(true);
          setSnackbarMessage(
            manageContactMessage.MSG_RBBP_023(
              deriveName(payeeToHandle.payeeName, data.nickname)
            )
          );
          setIsPosting(false);
          setPageName(menageContacts.PAYEES);
        }
      } catch (e) {
        if (isMounted()) {
          setIsPosting(false);
          if (e) {
            setIsAlertShowing(true);
            handleServerErrors(mode, e, payeeToHandle.payeeName, data.nickname);
          }
        }
      }
    }
    if (mode === modeName.CREATE_MODE) {
      const selectedCreditor = filterCreditorsByName(data.payeeName);
      let derivedNickname = "";
      if (data.nickname === undefined || data.nickname.length === 0) {
        derivedNickname = data.payeeName.substr(0, NICKNAME_NAME_LENGTH);
      } else {
        derivedNickname = data.nickname;
      }

      const submitData = {
        approvedCreditorId: selectedCreditor[0] && selectedCreditor[0].id,
        payeeCustomerReference: data.account,
        payeeNickname: derivedNickname
      };

      try {
        setIsPosting(true);
        result = await post(`${billPaymentsBaseUrl}/payees`, submitData);
        DataStore.del(BILL_PAYMENT_PAYEES);

        // Note the confirmationID in the response is available but unused at this time.
        if (result.status === 201 && isMounted()) {
          contactAnalytics.contactAdded(contactType.PAYEE);

          setContactsData(null);
          setOpenSnackbar(true);
          setIsPosting(false);
          setSnackbarMessage(
            manageContactMessage.MSG_RBBP_018(
              deriveName(data.payeeName, data.nickname)
            )
          );

          setPageName(menageContacts.PAYEES);
          history.push("/more/manage-contacts/payees"); // required to remove the #create from the url
        }
      } catch (error) {
        if (isMounted()) {
          setIsPosting(false);
          if (error) {
            setIsAlertShowing(true);
            handleServerErrors(mode, error, data.payeeName, data.nickname);
          }
        }
      }
    }
    return result;
  };

  // transferAuthentication is required as email ID is not registered for autodeposit
  // authenticationType = 0 Security question and answer defined at contact level.
  const getTransAuthForCreate = data => {
    return {
      authenticationType: 0,
      question: data.question,
      answer: data.answer
    };
  };

  const addRecipient = async data => {
    let submitData = {
      registrationName: recipientToHandle.aliasName,
      notificationHandle:
        recipientToHandle.notificationPreference[0].notificationHandle,
      oneTimeRecipient: false
    };

    if (!showAutodeposit) {
      submitData = {
        ...submitData,
        transferAuthentication: getTransAuthForCreate(data)
      };
    }
    try {
      setIsPosting(true);
      const result = await post(`${etransfersBaseUrl}/recipients`, submitData);
      if (result.status === 201 && isMounted()) {
        contactAnalytics.contactAdded(contactType.RECIPIENT);

        setContactsData(null);
        setOpenSnackbar(true);
        setIsPosting(false);

        setSnackbarMessage(
          manageContactMessage.MSG_RBET_036C(recipientToHandle.aliasName)
        );

        setPageName(menageContacts.RECIPIENTS);
        history.push("/more/manage-contacts/recipients");
        setRecipientToHandle(null);
      } else {
        throw new Error();
      }
    } catch (error) {
      if (isMounted()) {
        setIsPosting(false);
        if (error) {
          setIsAlertShowing(true);
          setAlertError(alertForRecipientSaveSystemError(confirmOnOk));
        }
      }
    }
  };

  const getApprovedCreditors = async setCreditors => {
    try {
      const approvedCreditors = await api.get(
        `${billPaymentsBaseUrl}/approvedCreditors`
      );
      if (!isMounted()) {
        return;
      }
      setApprovedCreditorsList(approvedCreditors.data);
      setCreditors(approvedCreditors.data);
    } catch (e) {
      if (isMounted()) {
        showErrorModal();
      }
    }
  };

  return {
    recipientToHandle,
    setRecipientToHandle,
    updateRecipient,
    payeeToHandle,
    setPayeeToHandle,
    updatePayee,
    contactsData,
    isLoading,
    setIsLoading,
    pageName,
    setPageName,
    openSnackbar,
    setOpenSnackbar,
    snackbarMessage,
    setSnackbarMessage,
    isAlertShowing,
    setIsAlertShowing,
    alertError,
    getTransferType,
    showAutodeposit,
    setShowAutodeposit,
    mode,
    setMode,
    addRecipient,
    getApprovedCreditors,
    setApprovedCreditorsList,
    isPosting,
    isProfileEnabled,
    setIsProfileEnabled,
    displayNoProfileModal,
    serverErrors,
    setServerErrors,
    clearServerError,
    contacts,
    updateContactState,
    updatePage,
    setContactsData,
    setLegalName
  };
};

export default useContacts;
