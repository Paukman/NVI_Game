import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";

import { transformDetails } from "ManageContacts/RecipientDetails/TransformDetails";
import cross from "assets/icons/Cross/cross.svg";
import LabelDetails from "Common/ReviewLabelDetails";
import {
  autodepositEnabledMessage,
  autodepositNotRegisteredMessage
} from "ManageContacts/alerts";

import { menageContacts, modeName } from "globalConstants";
import { Button } from "StyleGuide/Components";
import useManageContactAlerts from "../hooks/useManageContactAlerts";

import { ManageContactsContext } from "../ManageContactsProvider";

// TODO use global styles for buttons
import "Common/ReviewButtons/styles.scss";
import "./styles.scss";

const RecipientDetails = ({ id, recipient, setRecipient }) => {
  RecipientDetails.propTypes = {
    id: PropTypes.string.isRequired,
    recipient: PropTypes.shape({}).isRequired,
    setRecipient: PropTypes.func.isRequired
  };

  const { page } = useContext(ManageContactsContext);
  const { setPageName, setMode } = page;

  const { showDeleteRecipientModal } = useManageContactAlerts();

  const handleCloseDetails = () => {
    setPageName(menageContacts.RECIPIENTS);

    setRecipient(state => ({
      ...state,
      recipientDetails: null,
      transferType: null
    }));
  };

  const renderAutodepositMessage = () => {
    if (recipient.transferType === 2) {
      return autodepositEnabledMessage(
        recipient.recipientDetails.legalName,
        recipient.recipientDetails.notificationPreference[0].notificationHandle
      );
    }
    if (
      recipient.recipientDetails.defaultTransferAuthentication
        .authenticationType === "None" &&
      recipient.transferType !== 2
    ) {
      return autodepositNotRegisteredMessage();
    }

    return null;
  };

  const handleDelete = () => {
    showDeleteRecipientModal(recipient.recipientDetails);
  };

  const handleEdit = async () => {
    await setMode(modeName.EDIT_MODE);
    setPageName(menageContacts.EDIT_RECIPIENT);
  };

  return (
    <div className="manage-contacts-container">
      <div className="manage-contacts-header">
        <h3 id={`${id}-recipient-details-header`}>Recipient details</h3>
        <input
          id={`${id}-cross`}
          type="image"
          className="manage-contacts-cross"
          src={cross}
          alt="Close Recipient"
          onClick={handleCloseDetails}
        />
      </div>
      <Divider className="manage-contacts-divider" />
      <form
        onSubmit={e => e.preventDefault()}
        className="manage-contacts-form"
        id={`${id}-form`}
      >
        <LabelDetails
          id={`${id}-label-details`}
          labelData={transformDetails(recipient)}
        />
        {renderAutodepositMessage()}
        <div className="button-container">
          <div className="primary-button">
            <Button primary block onClick={handleEdit} text>
              Edit
            </Button>
          </div>
          <div className="text-button">
            <Button block text onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipientDetails;
