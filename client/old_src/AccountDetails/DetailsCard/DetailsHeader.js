import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Typography } from "antd";
import { formatCurrency } from "utils";

const { Text, Title } = Typography;

const DetailsHeader = ({ account, balance, availableBalance }) => {
  const balancePropType = PropTypes.shape({
    label: PropTypes.string.isRequired,
    amount: PropTypes.shape({
      value: PropTypes.number.isRequired,
      currency: PropTypes.string
    }).isRequired
  });
  DetailsHeader.propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      subType: PropTypes.string,
      number: PropTypes.string.isRequired,
      nickname: PropTypes.string
    }).isRequired,
    balance: balancePropType.isRequired,
    availableBalance: balancePropType
  };

  const renderBalance = bal => {
    const {
      label,
      amount: { value, currency }
    } = bal;
    const id = label.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="details-header__balance">
        <Text className="details-header__label" id={`${id}-title`}>
          {label}
        </Text>
        <Title
          level={3}
          className="details-header__title details-header__value"
          id={id}
        >
          {formatCurrency(value)}
          {currency && currency !== "CAD" && (
            <span className="details-header__currency">{` ${currency}`}</span>
          )}
        </Title>
      </div>
    );
  };

  return (
    <Row className="details-header">
      <Col xs={{ offset: 1, span: 22 }} md={{ span: 10 }}>
        <Text
          className="details-header__label"
          id="details-deposit-info-card-details-card-account-type"
        >
          {account.subType || account.type}
        </Text>
        <Title
          level={3}
          className="details-header__title"
          id="details-deposit-info-card-details-card-account-name"
        >
          {account.nickname || account.name}
        </Title>
        <Text
          className="details-header__subtitle"
          id="details-deposit-info-card-details-card-account-number"
        >
          {`${account.nickname ? `${account.name} | ` : ""}${account.number}`}
        </Text>
      </Col>

      <Col xs={{ offset: 1, span: 22 }} md={{ offset: 0, span: 12 }}>
        <div className="details-header__balance-container">
          {renderBalance(balance)}
          {availableBalance && renderBalance(availableBalance)}
        </div>
      </Col>
    </Row>
  );
};

export default DetailsHeader;
