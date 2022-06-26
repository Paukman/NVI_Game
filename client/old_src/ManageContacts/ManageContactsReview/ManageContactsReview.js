import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Icon, Skeleton, Button } from "StyleGuide/Components";
import { Divider } from "semantic-ui-react";
import PropTypes from "prop-types";
import { ReactComponent as BlueCross } from "assets/icons/BlueCross/bluecross.svg";
import { ReactComponent as Trashcan } from "assets/icons/TrashCan/trashcan.svg";
import { ReactComponent as Chevron } from "assets/icons/ChevronRight/chevron-right.svg";
import OverflowEmail from "Common/OverflowEmail";
import { getInitials, getPayeeName, getLastDigits } from "utils";
import api, { etransfersBaseUrl } from "api";
import useErrorModal from "utils/hooks/useErrorModal";
import { getNoContactMessage } from "ManageContacts/alerts";
import { menageContacts } from "globalConstants";
import { getLegalName } from "utils/getLegalName";
import useManageContactAlerts from "../hooks/useManageContactAlerts";
import { ManageContactsContext } from "../ManageContactsProvider";
import "styles/snackbar.scss";
import "./ManageContactsReview.scss";

// TODO - rename to ManageContactsList, this is rendering the list of contacts not a review view
const ManageContactsReview = ({
  id,
  isPayee,
  setRecipient,
  setPayeeDetails
}) => {
  ManageContactsReview.propTypes = {
    id: PropTypes.string.isRequired,
    isPayee: PropTypes.bool.isRequired,
    setRecipient: PropTypes.func.isRequired,
    setPayeeDetails: PropTypes.func.isRequired
  };

  const { showErrorModal } = useErrorModal();
  const { contactsInfo, page, recipient, payee } = useContext(
    ManageContactsContext
  );
  const {
    contactsData,
    isProfileEnabled,
    displayNoProfileModal,
    updateContactState
  } = contactsInfo;
  const { setPageName } = page;
  const { setRecipientToHandle, setShowAutodeposit, setLegalName } = recipient;
  const { setPayeeToHandle } = payee;

  const {
    showDeletePayeeModal,
    showDeleteRecipientModal,
    showIsNonSHA2Modal,
    showAutodepositChangeModal
  } = useManageContactAlerts();

  const { push } = useHistory();

  const formId = `${id}-form`;

  useEffect(() => {
    setRecipientToHandle(null);
  }, []);

  const renderPageTitle = () => {
    if (isPayee) {
      return contactsData.payees.length ? "Payees" : "No payees";
    }
    return contactsData.recipients.length ? "Recipients" : "No recipients";
  };

  const handleDelete = (e, contactToDelete) => {
    e.stopPropagation();
    if (isPayee) {
      setPayeeDetails(contactToDelete);
      showDeletePayeeModal(contactToDelete);
    } else {
      setRecipient(state => ({
        ...state,
        recipientDetails: contactToDelete
      }));
      showDeleteRecipientModal(contactToDelete);
    }
  };

  const handleRecipientDetails = async contactData => {
    setRecipient(state => ({
      ...state,
      recipientDetails: contactData
    }));
    setRecipientToHandle(contactData);

    const {
      defaultTransferAuthentication,
      notificationPreference
    } = contactData;
    try {
      const { data: result } = await api.post(`${etransfersBaseUrl}/options`, {
        email: notificationPreference[0].notificationHandle
      });

      const { transferType, customerName } = result[0];
      const legalName = getLegalName({}, customerName);

      setLegalName(legalName);
      setRecipient(state => ({
        ...state,
        recipientDetails: {
          ...state.recipientDetails,
          legalName: getLegalName(state, customerName)
        },
        transferType
      }));
      if (transferType === 0) {
        // If a recipient does not have autodeposit option, but auth is none,
        // we assume they have had an autodeposit change and are required to set
        // up a security question and answer
        if (defaultTransferAuthentication.authenticationType === "None") {
          // show modal MSG_RBET_060B
          updateContactState({
            name: "pageToReturnTo",
            value: menageContacts.RECIPIENTS
          });
          setShowAutodeposit(false);
          showAutodepositChangeModal();
        } else if (defaultTransferAuthentication.hashType !== "SHA2") {
          // Show modal MSG_ET_060B
          showIsNonSHA2Modal();
        } else {
          setPageName(menageContacts.RECIPIENT_DETAILS);
          setShowAutodeposit(false);
        }
      }
      if (transferType === 2) {
        setPageName(menageContacts.RECIPIENT_DETAILS);
        setShowAutodeposit(true);
      }
    } catch (e) {
      showErrorModal();
    }
  };

  const handlePayeeDetails = contactData => {
    setPageName(menageContacts.PAYEE_DETAILS);
    setPayeeDetails(contactData);
    setPayeeToHandle(contactData);
  };

  const handleDetails = contactData => {
    if (isPayee) {
      handlePayeeDetails(contactData);
    } else {
      handleRecipientDetails(contactData);
    }
  };

  const handleAddRecipient = () => {
    if (!isProfileEnabled) {
      displayNoProfileModal();
    } else {
      push("#create");
    }
  };

  const AddRecipientButton = props => (
    <Button
      data-testid="button-add-recipient"
      onClick={handleAddRecipient}
      link
      icon={
        <Icon component={BlueCross} role="button" aria-label="Add Recipient" />
      }
      {...props}
    >
      Add recipient
    </Button>
  );

  const AddPayeeButton = props => (
    <Button
      id="button-add-payee"
      data-testid="button-add-payee"
      link
      icon={<Icon component={BlueCross} role="button" aria-label="Add Payee" />}
      onClick={() => {
        push("#create");
      }}
      {...props}
    >
      Add payee
    </Button>
  );

  const renderNoContacts = () => {
    return (
      <div className="manage-contacts-form-no-contacts">
        <Divider />
        <p>{getNoContactMessage(isPayee)}</p>
        {isPayee ? (
          <AddPayeeButton link={false} icon={null} primary />
        ) : (
          <AddRecipientButton link={false} icon={null} primary />
        )}
      </div>
    );
  };

  const getKeyForEachRow = contact => {
    return isPayee ? contact.billPayeeId : contact.recipientId;
  };

  let contactList;
  if (contactsData) {
    contactList = isPayee ? contactsData.payees : contactsData.recipients;
  } else {
    contactList = new Array(8).fill(undefined);
  }

  const renderContacts = () => {
    if (!(contactList && contactList.length > 0)) {
      return renderNoContacts();
    }

    return contactList.map((contact, index) => (
      <div
        key={contact ? getKeyForEachRow(contact) : index}
        className="contact-row-background"
      >
        <div
          className="contact-row-container"
          role="presentation"
          id={`${formId}-contact-row-${index}`}
          onClick={() => handleDetails(contact)}
        >
          {contact ? (
            <>
              <div className="contact-initials">
                <span id={`${formId}-contact-initials`}>
                  {isPayee
                    ? getPayeeName(contact).toUpperCase()[0]
                    : getInitials(contact.aliasName)}
                </span>
              </div>
              <div className="contact-name">
                <p
                  id={`${formId}-contact-name`}
                  data-testid={
                    isPayee
                      ? `payee-${contact.payeeCustomerReference}`
                      : `recipient-${contact.aliasName}`
                  }
                >
                  {isPayee ? getPayeeName(contact) : contact.aliasName}
                </p>
                {isPayee ? (
                  <span id={`${formId}-contact-details`}>
                    ({getLastDigits(contact.payeeCustomerReference)})
                  </span>
                ) : (
                  <OverflowEmail id={`${formId}-contact-details`}>
                    {`(${contact.notificationPreference[0].notificationHandle})`}
                  </OverflowEmail>
                )}
              </div>
              <span className="contact-icons" id={`${formId}-contact-icons`}>
                <Button
                  id="manage-contact-trashcan"
                  data-testid={
                    isPayee
                      ? `payee-trashcan-${contact.payeeCustomerReference}`
                      : `recipient-trashcan-${contact.aliasName}`
                  }
                  className="contact-trashcan"
                  aria-label="Delete Contact"
                  onClick={e => handleDelete(e, contact)}
                  link
                  icon={<Icon component={Trashcan} />}
                />
                <Icon
                  component={Chevron}
                  role="img"
                  aria-label="Select Contact"
                  id="manage-contact-chevron"
                />
              </span>
            </>
          ) : (
            <div className="contact-skeleton">
              <Skeleton
                loading
                avatar
                paragraph={{ rows: 0 }}
                title={{ width: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    ));
  };

  const getHeaderClass = () => {
    let headerClass = "manage-contacts-review-header";
    if (!(contactList && contactList.length > 0)) {
      headerClass += " no-contacts";
    }
    return headerClass;
  };

  // TODO - class naming here should be refined, this is not a form
  return (
    <div className="manage-contacts-form-container">
      <div className={getHeaderClass()}>
        <h3>
          {contactsData ? (
            renderPageTitle()
          ) : (
            <Skeleton loading paragraph={{ rows: 1, width: ["200px"] }} />
          )}
        </h3>
        {!contactsData && (
          <Skeleton loading paragraph={{ rows: 1, width: ["100px"] }} />
        )}
        {contactsData && (
          <span className="add-button-span">
            {contactsData.payees.length !== 0 && isPayee && <AddPayeeButton />}
            {contactsData.recipients.length !== 0 && !isPayee && (
              <AddRecipientButton />
            )}
          </span>
        )}
      </div>
      {renderContacts()}
    </div>
  );
};

export default ManageContactsReview;
