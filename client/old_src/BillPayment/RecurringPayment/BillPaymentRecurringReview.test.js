import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import BillPaymentRecurringReview from "./BillPaymentRecurringReview";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import {
  recurringBillState
  // recurringBillStateNoPreparedData
} from "./constants";

describe("Recurring Bill Payment review page tests", () => {
  it(">> should call cancel alert when bill payment cancelled", () => {
    const onCancelReview = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {},
            recurringBillPay: {
              state: recurringBillState,
              onChange: () => null,
              prepareDataForReview: () => {},
              updateEndDateNoOfPaymentsMessage: () => null,
              onCancelReview
            }
          }}
        >
          <BillPaymentRecurringReview prevTab={() => ""} nextTab={() => ""} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const cancelButton = getByText("Cancel", { exact: true });
    fireEvent.click(cancelButton);
    expect(onCancelReview).toBeCalled();
  });

  it(">> should go back when edit clicked", () => {
    const prevTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {},
            recurringBillPay: {
              state: recurringBillState,
              onChange: () => null,
              prepareDataForReview: () => {},
              updateEndDateNoOfPaymentsMessage: () => null,
              onCancelReview: () => {}
            }
          }}
        >
          <BillPaymentRecurringReview prevTab={prevTab} nextTab={() => ""} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const editButton = getByText("Edit", { exact: true });
    fireEvent.click(editButton);
    expect(prevTab).toBeCalled();
  });

  it(">> should call onPayBill", () => {
    const onPayBill = jest.fn();
    const nextTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {},
            recurringBillPay: {
              state: recurringBillState,
              onChange: () => null,
              prepareDataForReview: () => {},
              updateEndDateNoOfPaymentsMessage: () => null,
              onCancelReview: () => {},
              onPayBill
            }
          }}
        >
          <BillPaymentRecurringReview prevTab={() => ""} nextTab={nextTab} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const payBillButton = getByText("Pay bill", { exact: true });
    fireEvent.click(payBillButton);
    expect(onPayBill).toBeCalledWith(nextTab);
  });
});
