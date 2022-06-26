import React from "react";
import PropTypes from "prop-types";

import LabelDetails, {
  transformScheduledPayment
} from "Common/ReviewLabelDetails";

import cross from "assets/icons/Cross/cross.svg";

import "./styles.scss";

// TODO - move up a level, get rid of Details folder
const Details = ({ data, handleDetailsClose, handleDeleteModal }) => {
  return (
    <div className="scheduled-payments-details">
      <div className="scheduled-payments-header">
        <h3 data-testid="header-scheduled-payment-details">
          Scheduled payment details
        </h3>
        <input
          type="image"
          className="scheduled-payments-cross"
          src={cross}
          alt="Close scheduled payment"
          onClick={handleDetailsClose}
        />
      </div>
      <div className="ui divider scheduled-payments-divider" />
      <form
        onSubmit={e => e.preventDefault()}
        className="scheduled-payments-form"
      >
        <LabelDetails labelData={transformScheduledPayment(data)} />
        <div className="button-container">
          <button
            className="ui button blue-border-button"
            aria-label="Delete"
            type="submit"
            onClick={handleDeleteModal}
          >
            Cancel scheduled payment
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
