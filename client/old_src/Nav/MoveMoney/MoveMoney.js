import React from "react";
import PropTypes from "prop-types";
import { useRouteMatch } from "react-router-dom";
import InteracETransfer from "InteracETransfer";
import BillPayment from "BillPayment";
import BillPaymentProvider from "BillPayment/BillPaymentProvider";
import Transfer from "Transfers";
import TransferProvider from "Transfers/TransferProvider";
import GlobalTransfers from "GlobalTransfers";
import RequireToggle from "Common/RequireToggle";

import "./styles.scss";

const BASE_PATH = "/move-money";
export const SubView = ({ sectionName, id }) => {
  switch (sectionName) {
    case "bill-payment":
      return (
        <BillPaymentProvider>
          <BillPayment />
        </BillPaymentProvider>
      );
    case "transfer-between-accounts":
      return (
        <TransferProvider>
          <Transfer />
        </TransferProvider>
      );
    case "send-money":
    case "request-money":
    case "etransfer-history":
    case "receive-money":
    case "fulfill-money": {
      return <InteracETransfer type={sectionName} id={id} />;
    }
    case "global-transfers":
      return (
        <RequireToggle toggle="rebank-global-transfers-enabled">
          <GlobalTransfers />
        </RequireToggle>
      );
    default: {
      return null;
    }
  }
};

// React.memo is used to prevent re-rendering. It will render the compnent only if the sectionName has changed.
// React.memo does shallow comparison and the props should be flat
const MemoView = React.memo(props => {
  MemoView.propTypes = {
    sectionName: PropTypes.string.isRequired,
    id: PropTypes.string
  };
  MemoView.defaultProps = {
    id: null
  };
  const { sectionName, id } = props;
  return <SubView sectionName={sectionName} id={id} />;
});

const MoveMoney = () => {
  const match = useRouteMatch(`${BASE_PATH}/:sectionName/:id?`);
  if (!match) return null;
  return (
    <MemoView sectionName={match.params.sectionName} id={match.params.id} />
  );
};

export default MoveMoney;
