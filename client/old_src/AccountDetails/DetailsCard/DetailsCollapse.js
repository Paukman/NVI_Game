import React from "react";
import PropTypes from "prop-types";
import Icon from "@ant-design/icons";
import { Col, Collapse, Grid, Typography } from "antd";
import { ReactComponent as Chevron } from "assets/icons/ChevronRight/chevron-right.svg";

const { Panel } = Collapse;
const { Link } = Typography;

const DetailsCollapse = ({ children }) => {
  DetailsCollapse.propTypes = {
    children: PropTypes.node.isRequired
  };
  const { md } = Grid.useBreakpoint();

  return md ? (
    children
  ) : (
    <Col xs={{ span: 22, offset: 1 }}>
      <Collapse
        className="details-collapse"
        ghost
        expandIconPosition="right"
        expandIcon={({ isActive }) => (
          <Icon
            component={Chevron}
            rotate={isActive ? -90 : 90}
            data-testid="account-details-collapse"
          />
        )}
      >
        <Panel
          header={
            <Link className="details-collapse__label">Account details</Link>
          }
          key="1"
        >
          {children}
        </Panel>
      </Collapse>
    </Col>
  );
};

export default DetailsCollapse;
