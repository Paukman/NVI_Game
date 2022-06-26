import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import BillPaymentOneTimeComplete from "./BillPaymentOneTimeComplete";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import { oneTimeBillState } from "./constants";

describe("Bill Payment complete page tests", () => {
  it(">> should go to create when Pay another bill clicked", () => {
    const callPayAnotherBill = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onCancelReview: () => {},
              onPayAnotherBill: callPayAnotherBill
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeComplete />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const payAnotherBillButton = getByText("Pay another bill", { exact: true });
    fireEvent.click(payAnotherBillButton);
    expect(callPayAnotherBill).toBeCalled();
  });
  it(">> Should verify presence of qualtrics ID", () => {
    const { container } = render(
      <RenderWithProviders>
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onCancelReview: () => {}
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeComplete />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );
    expect(container.querySelector("#qualtrics-payment-onetime").exists);
  });
  it(">> should go to overview", () => {
    const onGoToOverview = jest.fn();
    const callPayAnotherBill = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onCancelReview: () => {},
              onPayAnotherBill: callPayAnotherBill,
              onGoToOverview
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeComplete />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const goToOverview = getByText("Go to Overview", {
      exact: true
    });
    fireEvent.click(goToOverview);
    expect(onGoToOverview).toBeCalled();
  });
});
