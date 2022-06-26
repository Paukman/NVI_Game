import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const StatusBar = ({ id, percentage }) => {
  StatusBar.propTypes = {
    id: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired
  };
  return (
    <div id={id} className="status bar">
      <div
        id={`${id}-filler`}
        className={`filler ${percentage === 100 ? "complete" : ""}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default StatusBar;
