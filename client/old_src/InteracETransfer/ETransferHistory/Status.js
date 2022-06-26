import React from "react";
import PropTypes from "prop-types";
import { Typography } from "antd";

import { mapStatus } from "./Details/utils";

import "./styles.less";

const { Text } = Typography;

const Status = ({ status, showIcon = true }) => {
  return (
    <Text className="history-status" data-testid={mapStatus(status).status}>
      {showIcon && <img alt="status" src={mapStatus(status).icon} />}
      {mapStatus(status).status}
    </Text>
  );
};

Status.propTypes = {
  status: PropTypes.string.isRequired,
  showIcon: PropTypes.bool
};

export default Status;
