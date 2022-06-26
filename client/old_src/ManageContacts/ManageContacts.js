import React, { Fragment, useState, useEffect, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import TabMenuSelector from "Common/TabMenuSelector";
import ManageContactsReview from "ManageContacts/ManageContactsReview/ManageContactsReview";
import RecipientDetails from "ManageContacts/RecipientDetails";
import EditRecipient from "ManageContacts/EditRecipient";
import PayeeDetails from "ManageContacts/PayeeDetails";
import EditPayee from "ManageContacts/EditPayee";

import person from "assets/icons/Person/person.svg";
import payBill from "assets/icons/PayBill/pay-bill.svg";
import checkMarkIcon from "assets/icons/CheckMark/checkmark.svg";

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import { Grid } from "semantic-ui-react";

import { manageContactMessage } from "utils/MessageCatalog";
import { modeName, menageContacts } from "globalConstants";

import { ManageContactsContext } from "ManageContacts/ManageContactsProvider";
import "./styles.scss";

const id = "manage-contacts";

const ManageContacts = () => {
  const [isPayee, setIsPayee] = useState(false);
  const [recipient, setRecipient] = useState({
    recipientDetails: null,
    transferType: null
  });
  const [closeSnackbar, setCloseSnackbar] = useState(false);
  const [payeeDetails, setPayeeDetails] = useState(null);

  const history = useHistory();
  const loc = useLocation();

  const { contactsInfo, page } = useContext(ManageContactsContext);
  const { setIsLoading } = contactsInfo;
  const {
    pageName,
    setPageName,
    openSnackbar,
    setOpenSnackbar,
    snackbarMessage,
    setMode
  } = page;

  const actionTitleArray = [
    {
      name: "Recipients",
      class: !isPayee ? "active" : "inactive",
      icon: person
    },
    {
      name: "Payees",
      class: isPayee ? "active" : "inactive",
      icon: payBill
    }
  ];

  const handleCreateMode = async () => {
    await setMode(modeName.CREATE_MODE);
    if (isPayee || loc.pathname.includes("payees")) {
      setPayeeDetails({});
      setPageName(menageContacts.EDIT_PAYEE);
      setIsPayee(true);
    } else if (!isPayee || loc.pathname.includes("recipients")) {
      setRecipient(state => ({
        ...state,
        recipientDetails: {},
        transferType: null
      }));
      setPageName(menageContacts.EDIT_RECIPIENT);
      setIsPayee(false);
    }
  };

  const path = loc.pathname.split("/");
  const subPagePath = path[3]; // recipients or payees

  useEffect(() => {
    if (!loc.hash) {
      setMode(modeName.EDIT_MODE);
      switch (subPagePath) {
        case "recipients":
          setIsPayee(false);
          setPageName(menageContacts.RECIPIENTS);
          break;
        case "payees":
          setIsPayee(true);
          setPageName(menageContacts.PAYEES);
          break;
        default:
          break;
      }
    } else if (loc.hash === "#create") {
      handleCreateMode();
    }
  }, [loc]);

  const handleClick = index => {
    if (index === 1) {
      setIsPayee(true);
      setPageName(menageContacts.PAYEES);
      history.push("payees");
    } else {
      setIsPayee(false);
      setPageName(menageContacts.RECIPIENTS);
      history.push("recipients");
    }
  };

  const handleSnackState = () => {
    if (openSnackbar === true) {
      setCloseSnackbar(true);
      setIsLoading(true);
      return setTimeout(() => {
        setOpenSnackbar(false);
        setCloseSnackbar(false);
      }, 300);
    }
    return null;
  };
  const renderMessage = () => {
    return (
      <Grid className="snackbar-grid">
        <Grid.Column className="icon-grid" mobile={2} tablet={2} computer={2}>
          <img
            id={`${id}-checkmark-icon`}
            className="checkmark-icon"
            alt="Check Mark"
            src={checkMarkIcon}
          />
        </Grid.Column>
        <Grid.Column
          className="message-grid"
          mobile={14}
          tablet={14}
          computer={14}
        >
          <span id={`${id}-message`} className="snackbar-message">
            {snackbarMessage ||
              (isPayee
                ? manageContactMessage.MSG_RBBP_025C(
                    payeeDetails.payeeName,
                    payeeDetails.payeeNickname
                  )
                : manageContactMessage.MSG_RBET_036B(
                    recipient.recipientDetails.aliasName
                  ))}
          </span>
        </Grid.Column>
      </Grid>
    );
  };

  const renderSnackbar = () => {
    const transitionClass = closeSnackbar === true ? "transition-out" : "";

    return (
      <Snackbar
        id={`${id}-success-snackbar`}
        className={`success-snackbar ${transitionClass}`}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={openSnackbar}
        onClose={() => handleSnackState()}
        TransitionComponent={Slide}
        message={renderMessage()}
        autoHideDuration={3000}
      />
    );
  };

  const showHiddenSidebar = () => {
    switch (pageName) {
      case menageContacts.RECIPIENT_DETAILS:
      case menageContacts.EDIT_RECIPIENT:
      case menageContacts.EDIT_PAYEE:
        return "hidden";
      default:
        return "show";
    }
  };

  return (
    <div className="sidebar-container" id={`${id}-container`}>
      {openSnackbar && renderSnackbar()}
      <div className={`sidebar-tabs ${showHiddenSidebar()}`} id={`${id}-type`}>
        <TabMenuSelector
          id={id}
          title=""
          subTitle="Manage contacts"
          items={actionTitleArray}
          onClick={handleClick}
        />
      </div>
      <div className="sidebar-content">
        {(pageName === menageContacts.RECIPIENTS ||
          pageName === menageContacts.PAYEES) && (
          <ManageContactsReview
            isPayee={isPayee}
            id={id}
            setRecipient={setRecipient}
            setPayeeDetails={setPayeeDetails}
            setOpenSnackbar={setOpenSnackbar}
          />
        )}
        {!isPayee &&
          recipient.recipientDetails &&
          pageName === menageContacts.RECIPIENT_DETAILS && (
            <RecipientDetails
              id={id}
              recipient={recipient}
              setRecipient={setRecipient}
            />
          )}
        {isPayee &&
          payeeDetails &&
          pageName === menageContacts.PAYEE_DETAILS && (
            <PayeeDetails
              id={id}
              detailsData={payeeDetails}
              setPayeeDetails={setPayeeDetails}
            />
          )}
        {pageName === menageContacts.EDIT_RECIPIENT && <EditRecipient />}
        {payeeDetails && pageName === menageContacts.EDIT_PAYEE && (
          <Fragment>
            <EditPayee id={id} detailsData={payeeDetails} />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
