import { useContext } from "react";
import { AntModalContext } from "StyleGuide/Components/Modal";
import { menageContacts } from "globalConstants";
import { manageContactMessage } from "utils/MessageCatalog";
import api, { apiConfig, etransfersBaseUrl, payeeBaseUrl } from "api";
import { getLastDigits } from "utils";
import useIsMounted from "utils/hooks/useIsMounted";
import DataStore from "utils/store";
import { BILL_PAYMENT_PAYEES } from "utils/store/storeSchema";
import useContactAnalytics, {
  contactType
} from "utils/analytics/useContactAnalytics";
import { ManageContactsContext } from "../ManageContactsProvider";

const useManageContactAlerts = () => {
  const isMounted = useIsMounted();
  const { show: showModal } = useContext(AntModalContext);
  const {
    contactsInfo: { setIsLoading },
    page: { pageName, setPageName, setOpenSnackbar, setSnackbarMessage }
  } = useContext(ManageContactsContext);
  const eventTrackingAnalytics = useContactAnalytics();

  const showPendingTransferModal = recipientName => {
    showModal({
      title: manageContactMessage.MSG_RBET_020_TITLE,
      content: manageContactMessage.MSG_RBET_020(recipientName)
    });
  };

  const showPendingPayeeModal = (payeeName, payeeNickname) => {
    showModal({
      title: manageContactMessage.MSG_RBBP_026_TITLE,
      content: manageContactMessage.MSG_RBBP_026(payeeName, payeeNickname)
    });
  };

  const showIsNonSHA2Modal = () => {
    showModal({
      title: manageContactMessage.ADL_MSG_ET_060B_TITLE,
      content: manageContactMessage.ADL_MSG_ET_060B,
      okButton: {
        onClick: () => setPageName(menageContacts.EDIT_RECIPIENT)
      }
    });
  };

  const showAutodepositChangeModal = () => {
    showModal({
      title: manageContactMessage.MSG_RBET_060B_TITLE,
      content: manageContactMessage.MSG_RBET_060B,
      okButton: {
        onClick: () => setPageName(menageContacts.EDIT_RECIPIENT)
      }
    });
  };

  const showSystemErrorForPayee = (payeeName, payeeNickname) => {
    showModal({
      title: manageContactMessage.MSG_RBBP_027_TITLE,
      content: manageContactMessage.MSG_RBBP_027(payeeName, payeeNickname)
    });
  };

  const showSystemErrorForTransfer = recipientName => {
    showModal({
      title: manageContactMessage.MSG_RBET_020B_TITLE,
      content: manageContactMessage.MSG_RBET_020B(recipientName)
    });
  };

  const deleteRecipient = async ({ aliasName, recipientId }) => {
    try {
      await api.delete(
        `${etransfersBaseUrl}/recipients/${recipientId}`,
        apiConfig
      );
      if (!isMounted()) {
        return;
      }
      eventTrackingAnalytics.contactRemoved(contactType.RECIPIENT);
      setIsLoading(true);
      if (pageName !== menageContacts.RECIPIENTS) {
        setPageName(menageContacts.RECIPIENTS);
      }
      setSnackbarMessage(manageContactMessage.MSG_RBET_036B(aliasName));
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response?.status === 400) {
        showPendingTransferModal(aliasName);
      } else {
        showSystemErrorForTransfer(aliasName);
      }
    }
  };

  const deletePayee = async ({ billPayeeId, payeeName, payeeNickname }) => {
    try {
      await api.delete(`${payeeBaseUrl}/payees/${billPayeeId}`, apiConfig);
      DataStore.del(BILL_PAYMENT_PAYEES);
      if (!isMounted()) {
        return;
      }
      eventTrackingAnalytics.contactRemoved(contactType.PAYEE);
      setIsLoading(true);
      if (pageName !== menageContacts.PAYEES) {
        setPageName(menageContacts.PAYEES);
      }
      setSnackbarMessage(
        manageContactMessage.MSG_RBBP_025C(payeeName, payeeNickname)
      );
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response?.status === 422) {
        showPendingPayeeModal(payeeName, payeeNickname);
      } else {
        showSystemErrorForPayee(payeeName, payeeNickname);
      }
    }
  };

  const showDeletePayeeModal = payeeToDelete => {
    showModal({
      title: manageContactMessage.MSG_RBBP_025B_TITLE(
        payeeToDelete.payeeName,
        payeeToDelete.payeeNickname,
        getLastDigits(payeeToDelete.payeeCustomerReference)
      ),
      content: manageContactMessage.MSG_RBBP_025B,
      cancelButton: { text: "Cancel" },
      okButton: {
        text: "Delete payee",
        onClick: () => deletePayee(payeeToDelete),
        dataTestid: "manage-contacts-modal-delete-button-1"
      }
    });
  };

  const showDeleteRecipientModal = recipientToDelete => {
    showModal({
      title: manageContactMessage.MSG_RBET_036_TITLE,
      content: manageContactMessage.MSG_RBET_036(recipientToDelete.aliasName),
      cancelButton: { text: "Cancel" },
      okButton: {
        text: "Delete recipient",
        onClick: () => deleteRecipient(recipientToDelete),
        dataTestid: "manage-contact-modal-delete-button-1"
      }
    });
  };

  return {
    showDeletePayeeModal,
    showDeleteRecipientModal,
    showIsNonSHA2Modal,
    showAutodepositChangeModal
  };
};

export default useManageContactAlerts;
