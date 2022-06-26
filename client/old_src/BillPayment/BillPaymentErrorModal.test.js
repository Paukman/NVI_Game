import React from "react";
import {
  render,
  act,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { MemoryRouter, useHistory } from "react-router-dom";
import { mockApiData } from "utils/TestUtils";
import { eTransferErrors } from "utils/MessageCatalog";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import BillPayment from "./index";
import BillPaymentProvider from "./BillPaymentProvider";
import * as utils from "./BillPaymentProvider/hooks/utils";
import { payBillDataMock } from "./BillPaymentProvider/hooks/constants";

const {
  immediatePayBillsFromUrl,
  recurringPayBillsFromUrl,
  billPayeesUrl
} = utils;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn(),
    listen: jest.fn().mockReturnValue(jest.fn())
  })
}));

const renderBillPayment = async (type = "one-time#create") =>
  act(async () => {
    render(
      <MemoryRouter initialEntries={[`/move-money/bill-payment/${type}`]}>
        <MessageProvider>
          <ModalProvider>
            <BillPaymentProvider>
              <BillPayment />
            </BillPaymentProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  });

describe("BillPayment data fetch failing", () => {
  beforeEach(async () => {
    jest
      .spyOn(utils, "loadAccountAndPayee")
      .mockRejectedValueOnce("some error");
    await renderBillPayment();
  });

  it("should show error message modal when account or payee detail fail to load", async () => {
    await renderBillPayment();

    const { findByText } = screen;
    expect(
      await findByText(eTransferErrors.MSG_REBAS_000_CONTENT)
    ).toBeVisible();
  });

  it("should go back to Account Overview screen when OK button is clicked", async () => {
    mockApiData([
      {
        url: immediatePayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: recurringPayBillsFromUrl,
        results: payBillDataMock.fromBillAccounts
      },
      {
        url: billPayeesUrl,
        results: null
      }
    ]);

    await renderBillPayment();

    const mockUseHistory = useHistory();
    const { findByText, getByText } = screen;
    const okButton = await findByText("OK");
    expect(okButton).toBeVisible();
    act(() => {
      okButton.click();
    });
    await waitForElementToBeRemoved(() =>
      getByText(eTransferErrors.MSG_REBAS_000_CONTENT)
    );
    expect(mockUseHistory.push).toHaveBeenCalledWith("/overview");
  });
});
