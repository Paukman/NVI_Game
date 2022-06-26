import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import BillPaymentOneTimeReview from "./BillPaymentOneTimeReview";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import { oneTimeBillState } from "./constants";

describe("One Time Bill Payment review page tests", () => {
  it(">> should call cancel alert when bill payment cancelled", () => {
    const onCancelReview = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onCancelReview
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeReview prevTab={() => ""} nextTab={() => ""} />
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
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onCancelReview: () => {}
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeReview prevTab={prevTab} nextTab={() => ""} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const editButton = getByText("Edit", { exact: true });
    fireEvent.click(editButton);
    expect(prevTab).toBeCalled();
  });

  it(">> should call API on click of Pay bill ", () => {
    const onPayBill = jest.fn();
    const nextTab = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: oneTimeBillState,
              prepareDataForReview: () => {},
              onPayBill,
              onChangeSingleValue: () => {}
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeReview prevTab={() => ""} nextTab={nextTab} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const payBillButton = getByText("Pay bill", { exact: true });
    fireEvent.click(payBillButton);
    expect(onPayBill).toBeCalledWith(nextTab);
  });
  it(">> should call duplicatePayment when click on Pay bill ", () => {
    const onPayBill = jest.fn();
    const nextTab = jest.fn();
    const onShowDuplicatePayment = jest.fn();
    const { getByText } = render(
      <RenderWithProviders>
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: {
                ...oneTimeBillState,
                matchingPayments: [{ duplicatePayments: "dummy value" }]
              },
              prepareDataForReview: () => {},
              onPayBill,
              onChangeSingleValue: () => {},
              onShowDuplicatePayment
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeReview prevTab={() => ""} nextTab={nextTab} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );

    const payBillButton = getByText("Pay bill", { exact: true });
    fireEvent.click(payBillButton);
    expect(onPayBill).not.toBeCalled();
    expect(onShowDuplicatePayment).toBeCalledWith(nextTab, {
      duplicatePayments: "dummy value"
    });
  });
});
