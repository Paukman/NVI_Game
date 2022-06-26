import React from "react";
import { elementType, node, shape, string } from "prop-types";
import { Link } from "react-router-dom";
import { Typography } from "antd";

const { Text } = Typography;

const QuickAction = ({ id, icon, label, redirectTo }) => (
  <Link className="quick-action" to={{ ...redirectTo, type: "Quick action" }}>
    <img className="icon" src={icon} alt={label} />
    <Text className="text" id={id}>
      {label}
    </Text>
  </Link>
);

QuickAction.propTypes = {
  id: string.isRequired,
  label: node.isRequired,
  icon: elementType.isRequired,
  redirectTo: shape({
    pathname: string.isRequired
  }).isRequired
};

export default QuickAction;
