import { Typography, Alert } from "antd";
import dayjs from "dayjs";
import React from "react";

import {
  eTransferErrors,
  accountAndTransactionSummaryErrors
} from "utils/MessageCatalog";
import Onboarding from "Onboarding/Onboarding";
import useLoadAccounts from "./useLoadAccounts";
import Summaries from "./Summaries";
import Totals from "./Totals";
import LoadingSkeleton from "./LoadingSkeleton";

import "./sharedStyles.less";
import "./accountsOverviewStyles.less";

const { Text } = Typography;

const AccountsOverview = () => {
  const { accounts } = useLoadAccounts();

  const {
    generalError,
    fetchAccountErrors,
    loading,
    depositTotals,
    investmentTotals,
    loanTotals,
    creditCardTotals,
    prepaidCardTotals,
    allAccounts
  } = accounts;

  const date = dayjs().format("MMMM D, YYYY");

  return (
    <>
      <Text className="account-overview-date">{date}</Text>
      <div style={{ clear: "both" }} />
      <Onboarding />
      {generalError ? (
        <div className="account-overview-page-error">
          {eTransferErrors.MSG_REBAS_000}
        </div>
      ) : (
        <LoadingSkeleton loading={loading}>
          <div id="account-overview-detail" className="account-overview-page">
            {fetchAccountErrors?.creditcards && (
              <Alert
                className="credit-card-warning"
                description={accountAndTransactionSummaryErrors.MSG_REBAS_008}
                type="warning"
                showIcon
              />
            )}
            <Totals
              totals={{
                depositTotals,
                investmentTotals,
                loanTotals,
                creditCardTotals,
                prepaidCardTotals
              }}
            />
            <Summaries accounts={allAccounts} />
          </div>
        </LoadingSkeleton>
      )}
    </>
  );
};

export default AccountsOverview;
