import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";

import LabelDetails from "Common/ReviewLabelDetails";

import cross from "assets/icons/Cross/cross.svg";
import { transformScheduledTransfer } from "./transformScheduledTransfer";
import { TransferContext } from "../TransferProvider/TransferProvider";

import "styles/forms/global.scss";

const Details = ({ data, handleDetailsClose, handleDeleteModal }) => {
  const { scheduledTransfer } = useContext(TransferContext);
  useEffect(() => {
    return () => {
      scheduledTransfer.setIsViewingDetails(false);
    };
  }, []);

  return (
    <div className="scheduled-transfer-details">
      <div className="scheduled-transfer-header">
        <h3>Scheduled transfer details</h3>
        <input
          type="image"
          className="scheduled-transfer-cross"
          src={cross}
          alt="Close scheduled transfer"
          onClick={handleDetailsClose}
        />
      </div>
      <div className="ui divider scheduled-transfer-divider" />
      <form
        onSubmit={e => e.preventDefault()}
        className="scheduled-transfer-form"
      >
        <LabelDetails labelData={transformScheduledTransfer(data)} />
        <div className="button-container">
          <button
            className="ui button blue-border-button"
            aria-label="Cancel"
            type="submit"
            onClick={handleDeleteModal}
          >
            Cancel scheduled transfer
          </button>
        </div>
      </form>
    </div>
  );
};

Details.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleDetailsClose: PropTypes.func.isRequired,
  handleDeleteModal: PropTypes.func.isRequired
};

export default Details;
