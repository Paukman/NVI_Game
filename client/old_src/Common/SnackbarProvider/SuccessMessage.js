import React from "react";
import PropTypes from "prop-types";
import checkMarkIcon from "assets/icons/CheckMark/checkmark.svg";

const SuccessMessage = props => {
  SuccessMessage.propTypes = {
    children: PropTypes.node.isRequired
  };

  const { children } = props;
  return (
    <div className="snackbar-content">
      <img
        className="snackbar-icon"
        alt="check-mark-icon"
        src={checkMarkIcon}
      />
      <span data-testid="snackbar-message" className="snackbar-message">
        {children}
      </span>
    </div>
  );
};

export default SuccessMessage;
