import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Table } from "antd";
import DetailsCollapse from "./DetailsCollapse";

const getColumns = title => [
  {
    title,
    dataIndex: "detailRow"
  }
];

const DetailsTable = ({ leftTable, rightTable }) => {
  const tablePropTypes = PropTypes.shape({
    title: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  });
  DetailsTable.propTypes = {
    leftTable: tablePropTypes,
    rightTable: tablePropTypes
  };

  const getTableClasses = () => {
    if (!rightTable) {
      return {
        leftClasses: "hide-bottom-border--desktop hide-bottom-border--mobile",
        rightClasses: ""
      };
    }

    return {
      leftClasses: `${rightTable.title ? "hide-bottom-border--mobile" : ""} ${
        leftTable.data.length >= rightTable.data.length
          ? "hide-bottom-border--desktop"
          : ""
      }`,
      rightClasses: `hide-bottom-border--mobile ${
        rightTable.title ? "" : "full-width-table-header"
      } ${
        rightTable.data.length >= leftTable.data.length
          ? "hide-bottom-border--desktop"
          : ""
      }`
    };
  };

  const { leftClasses, rightClasses } = getTableClasses();

  const renderTable = table => (
    <Table
      className={table.classes || ""}
      // <br /> forces antd table header to be full height when no title
      columns={getColumns(table.title || <br />)}
      dataSource={table.data.map(({ label, value }, key) => ({
        detailRow: (
          <div
            className="details-table--row"
            id={label.toLowerCase().replace(/\s/g, "-")}
          >
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ),
        key
      }))}
      size="small"
      pagination={false}
    />
  );

  return (
    <Row className="details-table">
      <DetailsCollapse>
        <Col
          md={{ span: 10, offset: 2, pull: 1 }}
          data-testid="detail-table-left"
        >
          {renderTable({ ...leftTable, classes: leftClasses })}
        </Col>
        {rightTable && (
          <Col
            md={{ span: 10, offset: 2, pull: 1 }}
            data-testid="detail-table-right"
          >
            {renderTable({ ...rightTable, classes: rightClasses })}
          </Col>
        )}
      </DetailsCollapse>
    </Row>
  );
};

export default DetailsTable;
