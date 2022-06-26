import React from "react";
import { bool, element } from "prop-types";
import { Card, List, Typography, Row, Col, Divider, Skeleton } from "antd";

import "./loadingSkeletonStyles.less";

const { Title } = Typography;

const accountCards = [
  "deposit-card",
  "creditcard-card",
  "prepaidcard-card",
  "investment-card",
  "loan-card"
];

const AccountSkeleton = props => (
  <Skeleton paragraph={false} {...props} active round />
);

const TotalSkeletons = () => (
  <div className="totals">
    <Title level={5} className="overview-title">
      Totals
    </Title>
    <div className="total-skeletons">
      {accountCards.map(accountCard => (
        <Card
          key={`${accountCard}-total`}
          className={`${accountCard}-total no-border-radius`}
          bordered={false}
        >
          <AccountSkeleton className="total-skeleton" />
          <AccountSkeleton className="total-amount-skeleton" />
        </Card>
      ))}
    </div>
  </div>
);

const SummarySkeletons = () => (
  <div className="summary">
    <Title level={5} className="overview-title">
      Accounts
    </Title>
    <List className="account-overview">
      {accountCards.map((accountCard, i) => (
        <List.Item key={accountCard}>
          <Card className={`${accountCard} no-border-radius`} bordered={false}>
            <Row>
              <Col flex="1">
                <AccountSkeleton className="account-name-skeleton" />
              </Col>
              <Col flex="0">
                <AccountSkeleton className="current-balance-skeleton" />
              </Col>
              <Col flex="0">
                <AccountSkeleton className="available-balance-skeleton" />
              </Col>
            </Row>
            {i !== accountCards.length - 1 && (
              <>
                <Row>
                  <Col flex="auto">
                    <Divider />
                  </Col>
                </Row>
                <Row>
                  <Col className="quick-action-skeleton">
                    <AccountSkeleton className="account-detail-action-skeleton" />
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </List.Item>
      ))}
    </List>
  </div>
);

const AccountsOverviewSkeleton = ({ loading, children }) =>
  loading ? (
    <div className="account-overview-page skeleton" data-testid="skeleton">
      <TotalSkeletons />
      <SummarySkeletons />
    </div>
  ) : (
    children
  );

AccountsOverviewSkeleton.propTypes = {
  loading: bool.isRequired,
  children: element.isRequired
};

export default AccountsOverviewSkeleton;
