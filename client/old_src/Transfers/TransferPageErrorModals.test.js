import React from "react";
import {
  render,
  act,
  screen,
  waitForElementToBeRemoved
} from "@testing-library/react";
import * as reactRouterDom from "react-router-dom";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { eTransferErrors } from "utils/MessageCatalog";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import { singleAccountData } from "./constants";
import TransferProvider from "./TransferProvider";
import * as utils from "./TransferProvider/hooks/utils";
import Transfer from "./index";

const { MemoryRouter, useHistory } = reactRouterDom;
const {
  oneTimeImmediateTransferFromUrl,
  oneTimeFutureDatedTransferFromUrl,
  recurringTransferFromUrl,
  transfersToUrl
} = utils;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: jest.fn().mockReturnValue({
    goBack: jest.fn(),
    push: jest.fn(),
    listen: jest.fn().mockReturnValue(jest.fn())
  }),
  useLocation: jest.fn().mockReturnValue({
    pathname: "/move-money/transfer-between-accounts/one-time#create",
    state: { from: "/overview" }
  })
}));

const renderTransfer = async () =>
  act(async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/move-money/transfer-between-accounts/one-time#create"
        ]}
      >
        <MessageProvider>
          <ModalProvider>
            <TransferProvider>
              <Transfer />
            </TransferProvider>
          </ModalProvider>
        </MessageProvider>
      </MemoryRouter>
    );
  });

describe("TransferPage Error modals", () => {
  describe("Fetching API data error modal", () => {
    beforeEach(() => {
      windowMatchMediaMock();
      jest.spyOn(utils, "loadData").mockRejectedValueOnce("some error");
    });

    it(">> should show error message modal when account or payee detail fail to load and go back to Account Overview screen when OK button is clicked", async () => {
      await renderTransfer();

      const mockUseHistory = useHistory();
      const { findByText, getByText } = screen;
      const okButton = await findByText("OK");
      const errorMessage = await findByText(
        eTransferErrors.MSG_REBAS_000_CONTENT
      );
      expect(errorMessage).toBeVisible();
      okButton.click();

      await waitForElementToBeRemoved(() =>
        getByText(eTransferErrors.MSG_REBAS_000_CONTENT)
      );
      expect(mockUseHistory.push).toHaveBeenCalledWith("/overview");
    });
  });

  describe("Not enough eligible accounts error modal", () => {
    beforeEach(() => {
      windowMatchMediaMock();
    });

    it(">> should show not enough eligible accounts modal for no accounts", async () => {
      mockApiData([
        { url: oneTimeImmediateTransferFromUrl, results: [] },
        { url: oneTimeFutureDatedTransferFromUrl, results: [] },
        { url: recurringTransferFromUrl, results: [] },
        { url: transfersToUrl, results: [] }
      ]);
      await renderTransfer();
      const { findByText } = screen;

      const notSupportedText = await findByText("Not enough eligible accounts");
      expect(notSupportedText).toBeVisible();
    });

    it(">> should show not enough eligible accounts for the same accounts", async () => {
      mockApiData([
        {
          url: oneTimeImmediateTransferFromUrl,
          results: singleAccountData.singleAccount
        },
        {
          url: oneTimeFutureDatedTransferFromUrl,
          results: singleAccountData.singleAccount
        },
        {
          url: recurringTransferFromUrl,
          results: singleAccountData.singleAccount
        },
        { url: transfersToUrl, results: singleAccountData.singleAccount }
      ]);
      await renderTransfer();
      const { findByText } = screen;

      const notSupportedText = await findByText("Not enough eligible accounts");
      expect(notSupportedText).toBeVisible();
    });

    it(">> should go back to previous page when OK button is clicked", async () => {
      mockApiData([
        { url: oneTimeImmediateTransferFromUrl, results: [] },
        { url: oneTimeFutureDatedTransferFromUrl, results: [] },
        { url: recurringTransferFromUrl, results: [] },
        { url: transfersToUrl, results: [] }
      ]);
      const mockUseHistory = useHistory();

      await renderTransfer();
      const { findByText } = screen;

      const okButton = await findByText("OK");
      act(() => {
        okButton.click();
      });
      expect(mockUseHistory.goBack).toHaveBeenCalledTimes(1);
    });

    it(">> should redirect to overview page when OK button is clicked and location has no state", async () => {
      mockApiData([
        { url: oneTimeImmediateTransferFromUrl, results: [] },
        { url: oneTimeFutureDatedTransferFromUrl, results: [] },
        { url: recurringTransferFromUrl, results: [] },
        { url: transfersToUrl, results: [] }
      ]);
      jest.spyOn(reactRouterDom, "useLocation").mockReturnValue({
        pathname: "/move-money/transfer-between-accounts/one-time#create",
        state: undefined
      });
      const mockUseHistory = useHistory();

      await renderTransfer();
      const { findByText } = screen;

      const okButton = await findByText("OK");
      act(() => {
        okButton.click();
      });
      expect(mockUseHistory.push).toHaveBeenCalledWith("/overview");
    });
  });
});
