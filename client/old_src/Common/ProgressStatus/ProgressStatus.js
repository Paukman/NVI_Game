import React from "react";
import { Grid } from "semantic-ui-react";
import PropTypes from "prop-types";
import "./styles.scss";
import StatusBar from "./StatusBar";
import { getPercentage } from "./utils";

// we should improve this container to make the steps dynamic and accept more than 3 status'
const ProgressStatus = ({ id, status, className }) => {
  ProgressStatus.propTypes = {
    id: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
    className: PropTypes.string
  };

  ProgressStatus.defaultProps = {
    className: ""
  };

  const progressStatusClassName = className
    ? `progress-container stepper-progress-status ${className}`
    : "progress-container stepper-progress-status";

  const progressStatusId = `${id}-progress-status`;
  return (
    <div id={progressStatusId} className={progressStatusClassName}>
      <Grid>
        <Grid.Column>
          <h4
            id={`${progressStatusId}-create-title`}
            className={`${getPercentage(status) >= 33.33 ? "purple" : ""}`}
          >
            Create
          </h4>
        </Grid.Column>
        <Grid.Column>
          <h4
            id={`${progressStatusId}-review-title`}
            className={`${getPercentage(status) >= 66.66 ? "purple" : ""}`}
          >
            Review
          </h4>
        </Grid.Column>
        <Grid.Column>
          <h4
            id={`${progressStatusId}-send-title`}
            className={`${getPercentage(status) === 100 ? "purple" : ""}`}
          >
            Complete
          </h4>
        </Grid.Column>
      </Grid>
      <StatusBar id={`${id}-status-bar`} percentage={getPercentage(status)} />
    </div>
  );
};

export default ProgressStatus;
