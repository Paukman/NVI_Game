import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./styles.scss";

// Flag indicating the customer’s direct deposit
export const InteractStatuses = {
  0: {
    name: "PENDING",
    message: "Direct deposit registration confirmation is required.",
    cssClass: "interacStatusIndicator pending"
  },
  1: {
    name: "ACTIVE",
    message: "Direct deposit registration is active for transfers.",
    cssClass: "interacStatusIndicator active"
  },
  2: {
    name: "UNDER REVIEW",
    message: "Direct deposit registration being verified for fraud purposes.",
    cssClass: "interacStatusIndicator pending"
  },
  3: {
    name: "NOT ACTIVE",
    message: "Direct deposit registration has deleted or un registered.",
    cssClass: "interacStatusIndicator pending"
  },
  4: {
    name: "EXPIRED",
    message: "Direct deposit registration has expired.",
    cssClass: "interacStatusIndicator pending"
  },
  5: {
    name: "DECLINED",
    message: "Direct deposit registration is declined by customer.",
    cssClass: "interacStatusIndicator pending"
  },
  6: {
    name: "REPORTED",
    message: "Direct deposit registration is reported as scam by customer.",
    cssClass: "interacStatusIndicator pending"
  }
};

const InteracStatusIndicator = ({ interacStatus }) => {
  InteracStatusIndicator.propTypes = {
    interacStatus: PropTypes.number.isRequired
  };

  const baseStyleObj =
    interacStatus in InteractStatuses
      ? InteractStatuses[interacStatus]
      : { name: "INVALID STATUS", cssClass: "interacStatusIndicator pending" };

  return (
    <Fragment>
      <div className={baseStyleObj.cssClass}>
        <span
          data-testid={`interacStatus-${InteractStatuses[interacStatus].name}`}
          className={`${baseStyleObj.cssClass}-span`}
        >
          {baseStyleObj.name}
        </span>
      </div>
    </Fragment>
  );
};

export default InteracStatusIndicator;
