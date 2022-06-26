import React from "react";
import PropTypes from "prop-types";
import { Divider, Typography } from "antd";
import { Skeleton } from "StyleGuide/Components";
import "./PageHeader.less";

const { Title } = Typography;

const PageHeader = ({
  children,
  className = "",
  loading = false,
  ...props
}) => (
  <div className={`page-header ${className}`} {...props}>
    {loading ? (
      <Skeleton
        className="page-header--skeleton"
        loading
        paragraph={{ rows: 1, width: ["50%"] }}
        data-testid="page-header-skeleton"
      />
    ) : (
      <Title className="page-header--title" level={2}>
        {children}
      </Title>
    )}
    <Divider className="page-header--divider" />
  </div>
);

PageHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  loading: PropTypes.bool
};

export default PageHeader;
