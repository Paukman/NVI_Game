import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./styles.scss";

const NoScheduledTransactions = ({ data }) => {
  NoScheduledTransactions.propTypes = {
    data: PropTypes.shape({
      message: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      buttonAria: PropTypes.string.isRequired,
      buttonName: PropTypes.string.isRequired
    }).isRequired
  };

  return (
    <div className="no-scheduled-transactions">
      <p className="no-scheduled-copy">{data.message}</p>
      <Link to={data.url}>
        <button
          data-testid="button-no-scheduled"
          type="button"
          aria-label={data.buttonAria}
          className="no-scheduled-button"
        >
          {data.buttonName}
        </button>
      </Link>
    </div>
  );
};

export default NoScheduledTransactions;
