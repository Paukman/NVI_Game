import React, { useEffect } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Button, Divider } from "semantic-ui-react";
import { Skeleton } from "StyleGuide/Components";
import useWindowDimensions from "utils/hooks/useWindowDimensions";
import { eTransferErrors } from "utils/MessageCatalog";

import MobileTransactions from "./MobileTransactions";
import DesktopTransactions from "./DesktopTransactions";
import usePendingTransactions from "./usePendingTransactions";
import usePostedTransactions from "./usePostedTransactions";

import "./Transactions.scss";

const Transactions = ({ accountId, id, type, showErrorModal }) => {
  Transactions.propTypes = {
    accountId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    showErrorModal: PropTypes.func.isRequired
  };

  const containerId = `${id}-container`;

  const pending = usePendingTransactions({
    type,
    accountId
  });

  const posted = usePostedTransactions({
    type,
    accountId
  });

  const shouldShowErrorModal =
    (posted.isError && !posted.isFetchNextPageError) || pending.isError;

  useEffect(() => {
    if (shouldShowErrorModal) {
      showErrorModal();
    }
  }, [shouldShowErrorModal]);

  const renderSkeletons = rowCount => {
    const skeletons = [];
    for (let i = 0; i < rowCount; i += 1) {
      skeletons.push(
        <div className="transaction-skeleton-row" key={i}>
          <Skeleton loading paragraph={{ rows: 1, width: ["100%"] }} />
          <hr className="column-divider" />
        </div>
      );
    }
    return skeletons;
  };

  const { width } = useWindowDimensions();
  const getMobileComponent = () => {
    let component;

    if (type === "creditcard") {
      component = (
        <>
          <MobileTransactions
            title="Pending transactions"
            transactionsData={pending.transactions}
            id={containerId}
            isLoading={pending.isLoading}
          />
          <MobileTransactions
            title="Posted transactions"
            transactionsData={posted.transactions}
            id={containerId}
            isLoading={posted.isLoading}
          />
        </>
      );
    } else if (type === "deposit") {
      component = (
        <>
          {!!pending.transactions.length && (
            <MobileTransactions
              title="Pending transactions"
              transactionsData={pending.transactions}
              id={containerId}
              isLoading={pending.isLoading}
            />
          )}
          <MobileTransactions
            title="Posted transactions"
            transactionsData={posted.transactions}
            id={containerId}
            isLoading={posted.isLoading}
          />
        </>
      );
    } else {
      component = (
        <MobileTransactions
          title="Transactions"
          transactionsData={posted.transactions}
          id={containerId}
          isLoading={posted.isLoading}
        />
      );
    }

    return component;
  };

  const getDesktopComponent = () => {
    let component;

    if (type === "creditcard") {
      component = (
        <>
          <DesktopTransactions
            transactionsType={type}
            title="Pending transactions"
            transactionsData={pending.transactions}
            id={containerId}
            tableId="0"
            isLoading={pending.isLoading}
          />
          {!pending.isLoading && !pending.transactions.length && <Divider />}
          <DesktopTransactions
            transactionsType={type}
            title="Posted transactions"
            transactionsData={posted.transactions}
            id={containerId}
            tableId="1"
            isLoading={posted.isLoading}
          />
        </>
      );
    } else if (type === "deposit") {
      component = (
        <>
          {!!pending.transactions.length && (
            <DesktopTransactions
              transactionsType={type}
              title="Pending transactions"
              transactionsData={pending.transactions}
              id={containerId}
              tableId="0"
              isLoading={pending.isLoading}
              showBalanceColumn={false}
            />
          )}
          <DesktopTransactions
            transactionsType={type}
            title="Posted transactions"
            transactionsData={posted.transactions}
            id={containerId}
            tableId="1"
            isLoading={posted.isLoading}
          />
        </>
      );
    } else {
      component = (
        <DesktopTransactions
          title="Transactions"
          transactionsType={type}
          transactionsData={posted.transactions}
          id={containerId}
          tableId="0"
          isLoading={posted.isLoading}
        />
      );
    }

    return component;
  };

  return (
    <div id={containerId} className="transactions-container">
      {width < 768 && getMobileComponent()}
      {width >= 768 && getDesktopComponent()}
      {posted.hasNextPage && (
        <div className="more">
          {posted.isFetchingNextPage ? (
            renderSkeletons(4)
          ) : (
            <>
              {posted.isFetchNextPageError && (
                <div className="try-again-error">
                  <ExclamationCircleOutlined className="error-icon" />
                  <span className="no-more">
                    {eTransferErrors.MSG_REBAS_000_INLINE}
                  </span>
                </div>
              )}
              <Button
                id={`${containerId}-show-more`}
                basic
                className="atb"
                disabled={posted.isFetchingNextPage}
                onClick={() => posted.fetchNextPage()}
              >
                {posted.isFetchNextPageError ? "Try again" : "Show more"}
              </Button>
            </>
          )}
        </div>
      )}
      {!posted.hasNextPage && !!posted.transactions.length && (
        <div className="more">
          <span id={`${containerId}-no-more`} className="no-more">
            To review older transactions, see your e-statements.
            {/* disabled until e-statements is developed - easier than setting up a feature toggle, but can set one up if needed
              <a href="/more/e-statements"> e-statements</a>.
             */}
          </span>
        </div>
      )}
    </div>
  );
};

export default Transactions;
