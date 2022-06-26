import React from "react";
import { isNumber } from "lodash";
import { object, string, number, shape, bool } from "prop-types";
import { Card, Typography } from "antd";
import { formatCurrency } from "utils";

const { Title, Text } = Typography;

const TotalCard = ({ cardType, title, totals, hasOtherCurrency }) => {
  TotalCard.propTypes = {
    cardType: string.isRequired,
    title: string.isRequired,
    totals: shape({
      CAD: number,
      USD: number
    }),
    hasOtherCurrency: bool.isRequired
  };
  if (!totals || !Object.keys(totals).length) {
    return null;
  }

  const { CAD, USD } = totals;

  return (
    <Card
      className={`${cardType}-total no-border-radius`}
      bordered={false}
      data-testid={`${cardType}-total`}
    >
      <Text className="card-title">{title}</Text>
      <div className="balance">
        <Text strong className="cad-amount">
          {formatCurrency(CAD)}
          {hasOtherCurrency && (
            <span className="currency-label">{` ${"CAD"}`}</span>
          )}
        </Text>
        {isNumber(USD) && (
          <Text strong className="usd-amount">
            {formatCurrency(USD)}
            <span className="currency-label">{` ${"USD"}`}</span>
          </Text>
        )}
      </div>
    </Card>
  );
};

const Totals = ({ totals }) => {
  Totals.propTypes = {
    totals: shape({
      depositTotals: object,
      investmentTotals: object,
      loanTotals: object,
      creditCardTotals: object,
      prepaidCardTotals: object
    })
  };
  const hasOtherCurrency = Object.values(totals).some(
    total => total && isNumber(total.USD)
  );

  const {
    depositTotals,
    investmentTotals,
    loanTotals,
    creditCardTotals,
    prepaidCardTotals
  } = totals;

  return (
    <div className="totals">
      <Title level={5} className="overview-title">
        Totals
      </Title>
      <div className="total-details">
        <TotalCard
          cardType="deposit-card"
          title="Banking"
          totals={depositTotals}
          hasOtherCurrency={hasOtherCurrency}
        />
        <TotalCard
          cardType="creditcard-card"
          title="Credit cards"
          totals={creditCardTotals}
          hasOtherCurrency={hasOtherCurrency}
        />
        <TotalCard
          cardType="prepaidcard-card"
          title="Prepaid Mastercard"
          totals={prepaidCardTotals}
          hasOtherCurrency={hasOtherCurrency}
        />
        <TotalCard
          cardType="investment-card"
          title="Investments"
          totals={investmentTotals}
          hasOtherCurrency={hasOtherCurrency}
        />
        <TotalCard
          cardType="loan-card"
          title="Loans & mortgages"
          totals={loanTotals}
          hasOtherCurrency={hasOtherCurrency}
        />
      </div>
    </div>
  );
};

export default Totals;
