import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Divider } from "semantic-ui-react";
import { transformDetails } from "ManageContacts/PayeeDetails/TransformDetails";
import cross from "assets/icons/Cross/cross.svg";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import { menageContacts, modeName } from "globalConstants";
import { Button } from "StyleGuide/Components";
import useManageContactAlerts from "../hooks/useManageContactAlerts";
import { ManageContactsContext } from "../ManageContactsProvider";

import "../styles.scss";

const PayeeDetails = ({ id, detailsData, setPayeeDetails }) => {
  PayeeDetails.propTypes = {
    id: PropTypes.string.isRequired,
    detailsData: PropTypes.shape({
      billPayeeId: PropTypes.string,
      payeeName: PropTypes.string,
      payeeNickname: PropTypes.string,
      payeeCustomerReference: PropTypes.string
    }).isRequired,
    setPayeeDetails: PropTypes.func.isRequired
  };

  const { page } = useContext(ManageContactsContext);
  const { setPageName, setMode } = page;

  const { showDeletePayeeModal } = useManageContactAlerts();

  const handleCloseDetails = () => {
    setPageName(menageContacts.PAYEES);
    setPayeeDetails(null);
  };

  const handleDelete = () => {
    showDeletePayeeModal(detailsData);
  };

  const handleEdit = async () => {
    setPayeeDetails(detailsData);
    await setMode(modeName.EDIT_MODE);
    setPageName(menageContacts.EDIT_PAYEE);
  };

  return (
    <div className="manage-contacts-container">
      <div className="manage-contacts-header">
        <h3 id={`${id}-manage-contacts-header`}>Payee details</h3>
        <input
          id={`${id}-cross`}
          type="image"
          className="manage-contacts-cross"
          src={cross}
          alt="Close Payee"
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
          labelData={transformDetails(detailsData)}
        />
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

export default PayeeDetails;
