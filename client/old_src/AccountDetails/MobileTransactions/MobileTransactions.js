import React, { Fragment, useState } from "react";
import { Grid, Divider } from "semantic-ui-react";
import { formatCurrency, groupByDate } from "utils";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Skeleton } from "StyleGuide/Components";
import chevronDown from "assets/icons/ChevronDown/chevron-down.svg";
import chevronUp from "assets/icons/ChevronUp/chevron-up.svg";
import { setTitleId } from "./utils";
import CrossCurrencyDetails from "../CrossCurrencyDetails";

import "./styles.scss";

const MobileTransactionsComponent = ({
  id,
  title,
  transactionsData,
  isLoading = false
}) => {
  MobileTransactionsComponent.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    transactionsData: PropTypes.arrayOf(
      PropTypes.shape({
        transactionId: PropTypes.string,
        transactionDate: PropTypes.string.isRequired,
        netAmount: PropTypes.shape({
          currency: PropTypes.string,
          value: PropTypes.number.isRequired
        }),
        transactionStatus: PropTypes.string.isRequired,
        accountingEffectType: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const hasNone = !transactionsData.length && !isLoading;
  const transactionsByDate = groupByDate(transactionsData);

  const renderSkeletonRow = () => {
    const rowCount = 8;
    const skeletons = [];
    for (let i = 0; i < rowCount; i += 1) {
      skeletons.push(
        <div className="column-list row skeleton" key={i}>
          <Skeleton loading paragraph={{ rows: 1, width: ["100%"] }} />
          <hr className="column-divider" />
        </div>
      );
    }
    return skeletons;
  };

  const creditClassName = type => (type === "Credit" ? "green credit" : "");

  const creditBalanceDisplay = (type, value) => {
    if (type === "Credit") {
      return `+ ${formatCurrency(value, null)}`;
    }
    return formatCurrency(value, null);
  };

  const RenderRow = (transaction, rowIndex) => {
    const handleToggle = () => {
      setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
    };

    return (
      <Fragment key={transaction.key}>
        <Grid.Row
          columns={3}
          className={`transaction description ${
            transaction.exRateNet ? "transaction-row-pointer" : ""
          }`}
          verticalAlign="middle"
          onClick={transaction.exRateNet ? handleToggle : null}
        >
          <Grid.Column width={9}>
            <p id={`${id}-description-${rowIndex}`}>
              {transaction.description}
            </p>
          </Grid.Column>
          <Grid.Column width={5} floated="right" className="transaction value">
            <span
              id={`${id}-value-${rowIndex}`}
              className={creditClassName(transaction.accountingEffectType)}
            >
              {creditBalanceDisplay(
                transaction.accountingEffectType,
                transaction.netAmount.value,
                transaction.netAmount.currency
              )}
            </span>
          </Grid.Column>
          {transaction.exRateNet ? (
            <Grid.Column id="right-arrow" width={2} floated="right">
              <a
                role="button"
                href={null}
                className="column-list-chevron"
                id={`list-chevron-${rowIndex}`}
              >
                <img
                  alt="Show transaction details"
                  src={expandedRow === rowIndex ? chevronUp : chevronDown}
                />
              </a>
            </Grid.Column>
          ) : (
            <Grid.Column id="right-arrow" width={2} floated="right" />
          )}
        </Grid.Row>
        {transaction.exRateNet && (
          <Grid.Row
            style={{
              display: expandedRow === rowIndex ? "table-row" : "none"
            }}
            className="cross-currency-row"
          >
            <Grid.Column>
              <CrossCurrencyDetails transactionDetails={transaction} />
            </Grid.Column>
          </Grid.Row>
        )}
        <Divider filled="true" id="transactions-divider-mobile" />
      </Fragment>
    );
  };

  const renderTransactions = (data, transactionIdx) =>
    data.map((transaction, index) =>
      RenderRow(transaction, `${transactionIdx}-${index}`)
    );

  const renderDate = data => {
    const keys = Object.keys(data);

    if (keys.length === 0) {
      return "";
    }

    return keys.map((date, index) => (
      <Fragment key={date}>
        <Grid.Row className="transaction date">
          <Grid.Column>
            <p id={`${id}-date-${index}`}>
              {dayjs(date).format("MMM DD, YYYY")}
            </p>
          </Grid.Column>
        </Grid.Row>
        {renderTransactions(data[date], index)}
      </Fragment>
    ));
  };

  return (
    <Grid className="transaction details">
      <Grid.Row className="details title">
        <Grid.Column>
          <h4 id={setTitleId(title, id)}>{title}</h4>
        </Grid.Column>
      </Grid.Row>
      {isLoading ? renderSkeletonRow() : renderDate(transactionsByDate)}
      {hasNone === true && (
        <div className="no-transactions">
          There are no transaction records to display.
        </div>
      )}
    </Grid>
  );
};

export default MobileTransactionsComponent;
