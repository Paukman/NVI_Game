import React from "react";

export const getRequester = requestData => {
  let email = requestData.notificationPreference.find(
    n => n.notificationHandleType === "Email"
  );
  email = email ? ` (${email.notificationHandle})` : "";

  const requester =
    requestData.registrantType === "Retail"
      ? `${requestData.registrantName.retailName.firstName} ${requestData.registrantName.retailName.lastName}${email}`
      : `${requestData.registrantName.businessName.companyName}${email}`;

  return requester;
};

export const renderField = (fieldId, icon, label, value) => {
  return (
    <div className="form-field-static">
      <div>
        <div className="form-icon">
          <img src={icon} alt={label} />
        </div>
      </div>
      <div className="form-inputs">
        <label
          htmlFor={`${fieldId}-value`}
          className="form-label"
          id={`${fieldId}-label`}
        >
          {label}
        </label>
        <p className="form-value" id={`${fieldId}-value`}>
          {value}
        </p>
      </div>
    </div>
  );
};
