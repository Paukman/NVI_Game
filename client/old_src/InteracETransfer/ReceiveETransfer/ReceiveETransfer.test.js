import React from "react";
import { render, act, screen } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import ModalProvider from "Common/ModalProvider";
import { ReceiveETransferContext } from "./ReceiveETransferProvider";
import ReceiveETransfer from "./ReceiveETransfer";

describe("testing ReceiveETransfer", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render create interac profile page", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ReceiveETransferContext.Provider
            value={{
              userProfile: {
                profile: {
                  loading: false,
                  render: true
                }
              },
              receiveETransfer: {
                receiveEState: {
                  loading: true,
                  authenticated: false,
                  receiveMoneyData: null
                },
                onDeposit: () => null,
                onDecline: () => null
              }
            }}
          >
            <ReceiveETransfer />
          </ReceiveETransferContext.Provider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText(/Your profile lets/)).toBeTruthy();
  });

  it(">> should render AccountSelection component", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: {
                  profile: {
                    loading: false,
                    render: false
                  }
                },
                receiveETransfer: {
                  receiveEState: {
                    loading: false,
                    authenticated: true,
                    receiveMoneyData: {},
                    eligibleAccountsFormatted: []
                  }
                }
              }}
            >
              <ReceiveETransfer />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { findByText } = screen;
    expect(await findByText(/Select the account for the deposit/)).toBeTruthy();
  });
  it(">> should render ReceiveETransferForm component", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: {
                  profile: {
                    loading: false,
                    render: false
                  }
                },
                receiveETransfer: {
                  receiveEState: {
                    loading: false,
                    authenticated: false,
                    receiveMoneyData: {}
                  }
                }
              }}
            >
              <ReceiveETransfer />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText(/To accept or decline this/)).toBeTruthy();
  });
});
