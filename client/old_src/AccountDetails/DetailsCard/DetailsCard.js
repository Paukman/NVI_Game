import React from "react";
import { shape, bool, string } from "prop-types";
import { Card, Col, Row } from "antd";
import { Skeleton } from "StyleGuide/Components";
import QuickActions, { QuickActionTypes } from "Common/QuickActions";
import DetailsHeader from "./DetailsHeader";
import DetailsTable from "./DetailsTable";
import "./DetailsCard.less";

const DetailsSkeleton = () => (
  <Row
    className="padding-top-28 padding-bottom-28"
    gutter={[0, 32]}
    justify="space-between"
    align="bottom"
    data-testid="details-card-skeleton"
  >
    <Col xs={{ offset: 1, span: 11 }} md={{ offset: 1, span: 9 }}>
      <Skeleton loading paragraph={{ rows: 1, width: ["40%"] }} />
      <Skeleton loading paragraph={{ rows: 1, width: ["100%"] }} />
    </Col>

    <Col xs={{ offset: 1, span: 16 }} md={{ offset: 0, span: 9, pull: 1 }}>
      <Skeleton loading paragraph={{ rows: 1, width: ["100%"] }} />
    </Col>
  </Row>
);

const DetailsCard = ({ accountDetails, accountType, isLoading }) => {
  DetailsCard.propTypes = {
    accountDetails: shape({
      account: shape({}).isRequired,
      balance: shape({}).isRequired,
      availableBalance: shape({}),
      leftTable: shape({}),
      rightTable: shape({}),
      quickActions: shape(QuickActionTypes).isRequired
    }),
    accountType: string.isRequired,
    isLoading: bool.isRequired
  };

  if (!isLoading && !accountDetails) {
    return null;
  }

  return (
    <Card
      className={`details-card details-card--${accountType} no-border-radius`}
      bordered={false}
      data-testid="account-details-card"
    >
      {isLoading ? (
        <DetailsSkeleton />
      ) : (
        <>
          <DetailsHeader
            account={accountDetails.account}
            balance={accountDetails.balance}
            availableBalance={accountDetails.availableBalance}
          />
          {(accountDetails.leftTable || accountDetails.rightTable) && (
            <DetailsTable
              leftTable={accountDetails.leftTable}
              rightTable={accountDetails.rightTable}
            />
          )}
          <Row>
            <Col span={22} offset={1}>
              <QuickActions
                account={accountDetails.account}
                quickActions={accountDetails.quickActions}
              />
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
};

export default DetailsCard;
