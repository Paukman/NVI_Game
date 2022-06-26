import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import BillPaymentRecurringComplete from "./BillPaymentRecurringComplete";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import { recurringBillState } from "./constants";

describe("Tests for recurring bill payment complete page", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  it(">> should go to create when Pay another bill clicked", () => {
    const onPayAnotherBill = jest.fn();
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
              onCancelReview: () => {},
              onPayAnotherBill
            }
          }}
        >
          <BillPaymentRecurringComplete />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const payAnotherBillButton = getByText("Pay another bill", { exact: true });
    fireEvent.click(payAnotherBillButton);
    expect(onPayAnotherBill).toBeCalled();
  });
  it(">> Verify presence of qualtrics ID", () => {
    const { container } = render(
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
          <BillPaymentRecurringComplete />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    expect(container.querySelector("#qualtrics-payment-recurring").exists);
  });
});
