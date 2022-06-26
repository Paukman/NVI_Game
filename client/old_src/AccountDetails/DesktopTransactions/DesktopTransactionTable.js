import React, { Fragment, useState } from "react";
import { Grid } from "semantic-ui-react";
import dayjs from "dayjs";
import { formatCurrency } from "utils";
import PropTypes from "prop-types";
import { Skeleton } from "StyleGuide/Components";
import chevronDown from "assets/icons/ChevronDown/chevron-down.svg";
import chevronUp from "assets/icons/ChevronUp/chevron-up.svg";
import CrossCurrencyDetails from "../CrossCurrencyDetails";
import "./styles.scss";

const DesktopTransactionsComponent = ({
  id,
  tableId,
  transactionsType = "loan",
  title,
  transactionsData,
  isLoading,
  showBalanceColumn = true
}) => {
  DesktopTransactionsComponent.propTypes = {
    id: PropTypes.string.isRequired,
    tableId: PropTypes.string.isRequired,
    transactionsType: PropTypes.string,
    title: PropTypes.string.isRequired,
    transactionsData: PropTypes.arrayOf(
      PropTypes.shape({
        transactionId: PropTypes.string,
        transactionDate: PropTypes.string.isRequired,
        netAmount: PropTypes.shape({
          currency: PropTypes.string,
          value: PropTypes.number.isRequired
        }),
        runningBalance: PropTypes.shape({
          currency: PropTypes.string,
          value: PropTypes.number.isRequired
        }),
        transactionStatus: PropTypes.string.isRequired,
        accountingEffectType: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        key: PropTypes.string.isRequired
      })
    ).isRequired,
    isLoading: PropTypes.bool.isRequired,
    showBalanceColumn: PropTypes.bool
  };

  const [expandedRow, setExpandedRow] = useState(null);

  const hasNone = !transactionsData.length && !isLoading;

  const formatDate = date => {
    return dayjs(date).format("MMM DD, YYYY");
  };

  const creditClassName = type => (type === "Credit" ? "green credit" : "");

  const creditBalanceDisplay = (type, value) => {
    if (type === "Credit") {
      return `+ ${formatCurrency(value, null)}`;
    }
    return formatCurrency(value, null);
  };

  // TODO: replace when running balances are provided
  const runningBalance = balance => {
    if (balance === undefined) {
      return formatCurrency(1234.56, null);
    }
    return formatCurrency(balance.value, null);
  };

  const renderSkeletons = () => {
    const rowCount = 8;
    const skeletons = [];
    for (let i = 0; i < rowCount; i += 1) {
      skeletons.push(
        <tr className="transaction-skeleton-row" key={i}>
          <td>
            <Skeleton loading paragraph={{ rows: 1, width: ["100%"] }} />
            <hr className="column-divider" />
          </td>
        </tr>
      );
    }
    return skeletons;
  };

  const RenderRow = (transaction, rowIndex) => {
    const handleRowToggle = () => {
      setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
    };

    return (
      <Fragment key={transaction.key}>
        <tr
          className={`transaction-row ${
            transaction.exRateNet ? "transaction-row-pointer" : ""
          }`}
          onClick={transaction.exRateNet ? handleRowToggle : null}
        >
          <td className="spacer left" />
          <td className="date column">
            <p id={`${id}-date-${tableId}-${rowIndex}`} className="values">
              {formatDate(transaction.transactionDate)}
            </p>
          </td>
          <td className="description column">
            <p id={`${id}-description-${tableId}-${rowIndex}`}>
              {transaction.description}
            </p>
          </td>
          <td className="amount column">
            <span
              id={`${id}-value-amount-${tableId}-${rowIndex}`}
              className={creditClassName(transaction.accountingEffectType)}
            >
              {creditBalanceDisplay(
                transaction.accountingEffectType,
                transaction.netAmount.value,
                transaction.netAmount.currency
              )}
            </span>
          </td>
          {transactionsType !== "creditcard" && showBalanceColumn && (
            <>
              <td className="balance column">
                <span id={`${id}-value-balance-${tableId}-${rowIndex}`}>
                  {runningBalance(transaction.runningBalance)}
                </span>
              </td>
              {transaction.exRateNet ? (
                <td className="subtitle spacer right">
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
                </td>
              ) : (
                <td className="spacer right" />
              )}
            </>
          )}
        </tr>
        {transaction.exRateNet && (
          <tr
            className="transaction-row"
            style={{
              display: expandedRow === rowIndex ? "table-row" : "none"
            }}
          >
            <td className="spacer left" />
            <td colSpan={4} className="detail column">
              <CrossCurrencyDetails transactionDetails={transaction} />
            </td>
            <td className="spacer right" />
          </tr>
        )}
      </Fragment>
    );
  };

  const renderTransactionTable = () => (
    <>
      {transactionsData.length > 0 && (
        <thead>
          <tr className="transactions subtitle">
            <td className="subtitle spacer left" />
            <td className="date header">
              <p id={`${id}-date-header-${tableId}`}>Date</p>
            </td>
            <td className="description header">
              <p id={`${id}-description-header-${tableId}`}>Description</p>
            </td>
            <td className="amount header">
              <p id={`${id}-amount-header-${tableId}`}>Amount</p>
            </td>
            {transactionsType !== "creditcard" && showBalanceColumn && (
              <>
                <td className="balance header">
                  <p id={`${id}-balance-header-${tableId}`}>Balance</p>
                </td>
              </>
            )}
            <td className="subtitle spacer right" />
          </tr>
        </thead>
      )}
      <tbody>{transactionsData.map(RenderRow)}</tbody>
    </>
  );

  return (
    <Grid className="transaction displaytable">
      <div className="transactions title">
        <h4 id={`${id}-title-${tableId}`}>{title}</h4>
      </div>
      <table className="transactions table">
        {isLoading ? (
          <tbody>{renderSkeletons()}</tbody>
        ) : (
          renderTransactionTable()
        )}
      </table>
      {hasNone === true && (
        <div className="no-transactions">
          There are no transaction records to display.
        </div>
      )}
    </Grid>
  );
};

export default DesktopTransactionsComponent;
