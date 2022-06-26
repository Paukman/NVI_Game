import React from "react";
import { arrayOf, bool, shape, string } from "prop-types";
import { mapQuickActions } from "./mapQuickActions";
import QuickAction from "./QuickAction";
import "./QuickActions.less";

export const QuickActionTypes = {
  contribute: bool,
  etransfer: bool,
  makeBillPayment: bool,
  makePayment: bool,
  payBill: bool,
  transferFrom: bool,
  reload: bool
};

const QuickActions = ({ account, quickActions }) => {
  const mappedQuickActions = mapQuickActions(quickActions, account);
  if (!mappedQuickActions.length) {
    return null;
  }

  return (
    <div
      className="quick-actions"
      data-testid={`quick-actions-${account.number}`}
    >
      {mappedQuickActions.map(action => (
        <QuickAction {...action} key={action.label} />
      ))}
    </div>
  );
};

QuickActions.propTypes = {
  account: shape({
    bankAccount: shape({
      accountId: string.isRequired,
      routingId: string.isRequired,
      country: string.isRequired
    }),
    creditCardNumber: string,
    currency: string,
    associatedCreditCardNumbers: arrayOf(string),
    name: string.isRequired,
    number: string.isRequired,
    type: string.isRequired
  }).isRequired,
  quickActions: shape(QuickActionTypes).isRequired
};

export default QuickActions;
