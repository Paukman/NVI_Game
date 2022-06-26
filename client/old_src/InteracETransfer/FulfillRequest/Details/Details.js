import React from "react";
import PropTypes from "prop-types";
import useWindowDimensions from "utils/hooks/useWindowDimensions";

import { Link } from "react-router-dom";
import LabelDetails from "Common/ReviewLabelDetails";
import PageHeader from "Common/PageHeader";
import { transformFulfillRequest } from "InteracETransfer/FulfillRequest/transformFulfillRequest";
import "./styles.scss";

const Details = ({ requestData, postData }) => {
  Details.propTypes = {
    requestData: PropTypes.shape({}).isRequired,
    postData: PropTypes.shape({}).isRequired
  };

  const { width } = useWindowDimensions();
  const hasFromAccount = postData.from && postData.from.id;

  return (
    <div className="fulfill-request-details">
      <PageHeader>Fulfill a request for money</PageHeader>
      <LabelDetails
        labelData={transformFulfillRequest(requestData, postData, width)}
        id="fulfill-request"
      />
      <div className="button-container">
        {hasFromAccount && (
          <a
            href={`/details/deposit/${postData.from.id}`}
            aria-label="View account sending money"
            className="fulfill-view-account"
          >
            View account
          </a>
        )}
        <Link to="/overview">
          <button
            className={
              hasFromAccount
                ? "ui button blue-border-button"
                : "ui button blue-border-button only"
            }
            aria-label="Go to overview page"
            type="submit"
            onClick={() => {}}
          >
            Go to Overview
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Details;
