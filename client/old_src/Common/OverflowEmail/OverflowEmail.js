import React from "react";
import PropTypes from "prop-types";
import "./OverflowEmail.less";

const OverflowEmail = ({ children, className = "", ...props }) => {
  OverflowEmail.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };
  if (typeof children !== "string") {
    return children;
  }

  const [emailName, emailDomain] = children.split("@");

  return (
    <span
      {...props}
      className={`overflow-email ${className}`}
      data-testid="overflow-email"
    >
      <span className="overflow-email--name" data-testid="email-name">
        {emailName}
      </span>
      <span className="overflow-email--domain" data-testid="email-domain">
        {emailDomain ? `@${emailDomain}` : ""}
      </span>
    </span>
  );
};

export default OverflowEmail;
