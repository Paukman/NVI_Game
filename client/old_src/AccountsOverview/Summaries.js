import React from "react";
import { arrayOf, number, oneOfType, shape, string } from "prop-types";
import { Link } from "react-router-dom";
import { Card, List, Typography, Row, Col } from "antd";
import { formatCurrency } from "utils";
import chevron from "assets/icons/RightChevron/rightChevron.svg";
import QuickActions, { QuickActionTypes } from "Common/QuickActions";

const { Title, Text } = Typography;
const accountPropType = {
  id: string.isRequired,
  type: string.isRequired,
  subType: string,
  name: string.isRequired,
  number: string.isRequired,
  currentBalance: oneOfType([string, number]).isRequired,
  availableBalance: oneOfType([string, number]),
  currency: string.isRequired,
  quickActions: shape(QuickActionTypes)
};

const CURRENT_BALANCE_LABEL = "Current balance";
const AVAILABLE_BALANCE_LABEL = "Available balance";
const AVAILABLE_CREDIT_LABEL = "Available credit";
const PRINCIPAL_BALANCE_LABEL = "Principal balance";
const INVESTMENT_VALUE_LABEL = "Value";

const accountDisplayData = {
  deposit: {
    label: "Banking",
    currentBalanceLabel: CURRENT_BALANCE_LABEL,
    availableBalanceLabel: AVAILABLE_BALANCE_LABEL
  },
  loan: {
    label: "Loans & mortgage",
    currentBalanceLabel: PRINCIPAL_BALANCE_LABEL,
    availableBalanceLabel: AVAILABLE_BALANCE_LABEL
  },
  investment: {
    label: "Investment",
    currentBalanceLabel: INVESTMENT_VALUE_LABEL
  },
  creditcard: {
    label: "Credit cards",
    currentBalanceLabel: CURRENT_BALANCE_LABEL,
    availableBalanceLabel: AVAILABLE_CREDIT_LABEL
  },
  prepaidmastercard: {
    label: "Prepaid Mastercard",
    currentBalanceLabel: CURRENT_BALANCE_LABEL,
    availableBalanceLabel: AVAILABLE_BALANCE_LABEL
  }
};

const getAccountDisplayData = (type, subType) =>
  accountDisplayData[subType] || accountDisplayData[type];

const Summary = ({ account }) => {
  Summary.propTypes = {
    account: shape(accountPropType)
  };
  const {
    id,
    type,
    subType,
    name,
    number: accountNumber,
    currency,
    currentBalance,
    availableBalance,
    quickActions
  } = account;
  const {
    label,
    currentBalanceLabel,
    availableBalanceLabel
  } = getAccountDisplayData(type, subType);
  const availableBalanceFormatted = formatCurrency(availableBalance);
  const currentBalanceFormatted = formatCurrency(currentBalance);
  const shouldShowCurrency = currency !== "CAD";

  return (
    <List.Item>
      <Card className={`${type}-card no-border-radius`} bordered={false}>
        <Link to={`/details/${type}/${id}`} className="block">
          <Row className="account-info-row">
            <Col flex="1">
              <Text className="account-label">{label}</Text>
              <Text
                id={`${type}-account`}
                strong
                className="account-description"
                data-testid={`${name} (${accountNumber})`}
              >
                {name}
                {name.endsWith("Mastercard") && <sup>®</sup>} ({accountNumber})
              </Text>
            </Col>
            {currentBalanceLabel && (
              <Col flex="0" className="current-balance">
                <Text className="account-label">{currentBalanceLabel}</Text>
                <Text
                  id={`${type}-${
                    type === "loan" ? "principal" : "current"
                  }-balance`}
                  strong
                >
                  {currentBalanceFormatted}
                  {shouldShowCurrency && <span>{` ${currency}`}</span>}
                </Text>
              </Col>
            )}
            {availableBalanceLabel && (
              <Col flex="0" className="available-balance">
                <Text className="account-label">{availableBalanceLabel}</Text>
                <Text id={`${type}-available-balance`} strong>
                  {availableBalanceFormatted}
                  {shouldShowCurrency && <span>{` ${currency}`}</span>}
                </Text>
              </Col>
            )}
            <Col flex="0">
              <img className="chevron-icon" alt="Right Arrow" src={chevron} />
            </Col>
          </Row>
        </Link>

        <QuickActions account={account} quickActions={quickActions} />
      </Card>
    </List.Item>
  );
};

const Summaries = ({ accounts }) => {
  Summaries.propTypes = {
    accounts: arrayOf(shape(accountPropType)).isRequired
  };

  return (
    <div className="summary">
      <Title level={5} className="overview-title">
        Accounts
      </Title>
      <List
        className="account-overview"
        itemLayout="horizontal"
        dataSource={accounts}
        renderItem={account => <Summary account={account} />}
      />
    </div>
  );
};

export default Summaries;
