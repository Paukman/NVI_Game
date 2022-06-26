import React, { Fragment } from "react";
import { arrayOf, bool, func, objectOf, shape, string } from "prop-types";
import { Row, Col, Typography } from "antd";
import error16Icon from "assets/icons/error-16.svg";
import chevronIcon from "assets/icons/chevron-right.svg";
import noFailedTxnIcon from "assets/icons/nofailed-txn.svg";
import { formatDate } from "utils";
import { failedTransactionMessages } from "utils/MessageCatalog";

const { Title, Text } = Typography;

const FailedTransactionList = ({ failedTransactions = {}, onClick }) => {
  FailedTransactionList.propTypes = {
    failedTransactions: objectOf(
      arrayOf(
        shape({
          id: string.isRequired,
          isAcknowledged: bool.isRequired,
          desc: string.isRequired
        })
      ).isRequired
    ),
    onClick: func.isRequired
  };

  const sortByDateDesc = (a, b) => (a < b ? 1 : -1);

  const dates = Object.keys(failedTransactions).sort(sortByDateDesc);

  return dates.length > 0 ? (
    dates.map(date => {
      return (
        <Fragment key={date}>
          <Row
            align="middle"
            className="date-row"
            data-testid="failed-transaction-date-row"
          >
            <Col className="failed-transaction-date" span={22} offset={2}>
              {formatDate(date)}
            </Col>
          </Row>

          {failedTransactions[date].map(ft => (
            <Row
              onClick={() => onClick(ft)}
              align="middle"
              className={`failed-transaction-row ${
                ft.isAcknowledged ? "read" : "unread"
              }`}
              key={ft.id}
            >
              <Col offset={2} span={19}>
                <Row>
                  <Col xs={{ span: 3 }} sm={{ span: 2 }}>
                    <img alt="Error icon" src={error16Icon} />
                  </Col>
                  <Col xs={{ span: 19 }} sm={{ span: 20 }}>
                    <div className="padding-bottom-7">
                      <span className="failed-transaction-title">
                        Failed Transaction
                      </span>

                      {!ft.isAcknowledged && (
                        <div
                          className="red-dot"
                          data-testid="failed-transaction-unread-dot"
                        />
                      )}
                    </div>
                    <div className="description">{ft.desc}</div>
                  </Col>
                </Row>
              </Col>
              <Col offset={1} span={1}>
                <img alt="Chevron icon" src={chevronIcon} />
              </Col>
            </Row>
          ))}
        </Fragment>
      );
    })
  ) : (
    <div className="no-transaction">
      <img alt="No transaction icon" src={noFailedTxnIcon} />
      <Title className="no-transaction__title" level={4}>
        {failedTransactionMessages.MSG_RBFTA_006_TITLE}
      </Title>
      <Text className="no-transaction__text">
        {failedTransactionMessages.MSG_RBFTA_006}
      </Text>
    </div>
  );
};
export default FailedTransactionList;
