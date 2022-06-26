import React from "react";
import { render, act, screen } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import { receiveETransferErrors } from "utils/MessageCatalog";
import ModalProvider from "Common/ModalProvider";
import { PromptContext } from "Common/PromptProvider";
import ReceiveETransferForm from "./ReceiveETransferForm";
import { ReceiveETransferContext } from "./ReceiveETransferProvider";

describe("E-Transfer receive form to accept e-transfer tests", () => {
  beforeEach(async () => {
    windowMatchMediaMock();
  });

  it(">> should show a skeleton while userProfile is loading.", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: true } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByTestId } = screen;

    const skeleton = getByTestId("receive-etransfer-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> should show a skeleton while receiveMoneyData is undefined.", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: true } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: undefined,
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByTestId } = screen;

    const skeleton = getByTestId("receive-etransfer-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> Should render form with appropriate values", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    await act(async () => {
      expect(getByText("From")).toBeTruthy();
      expect(getByText("Message from sender")).toBeTruthy();
      expect(getByText("Security question")).toBeTruthy();
      expect(getByText("Security answer")).toBeTruthy();
    });
  });

  it(">> Should render `Submit` button", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    await act(async () => {
      expect(getByText("Submit")).toBeDefined();
    });
  });

  it(">> Should display inline error message when empty security answer is submitted", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </RenderWithProviders>
      );
    });
    const { getByText, findByText } = screen;

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = await findByText(
      receiveETransferErrors.MSG_RBET_017Bs
    );
    await act(async () => {
      expect(errorMessage).toBeTruthy();
    });
  });

  it(">> Should allow user to proceed to next page after Submit is successful", async () => {
    const onCommit = jest.fn();
    const { getByText, findByLabelText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {
              blocked: true,
              blockedCloseBrowser: true,
              showModal: false,
              confirm: false
            },
            onCommit,
            blockLocation: () => null,
            blockClosingBrowser: () => null,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "some answer" }
      });
    });

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await act(async () => {
      expect(onCommit).toBeCalled();
    });
  });

  it(">> Should block user from navigating away when a value is changed in the form", async () => {
    const blockLocation = jest.fn();
    const { findByLabelText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {},
            onCommit: () => null,
            blockLocation,
            blockClosingBrowser: () => null,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "some answer" }
      });
    });

    await act(async () => {
      expect(blockLocation).toBeCalledTimes(1);
    });
  });

  it(">> Should block user from closing browser when a value is changed in the form", async () => {
    const blockClosingBrowser = jest.fn();
    const { findByLabelText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {},
            onCommit: () => null,
            blockLocation: () => null,
            blockClosingBrowser,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );

    const securityAnswerInput = await findByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "some answer" }
      });
    });

    await act(async () => {
      expect(blockClosingBrowser).toBeCalledTimes(1);
    });
  });

  it(">> Should continue blocking user from navigating away if Submit is unsuccessful", async () => {
    const onCommit = jest.fn();
    const { getByText, findByText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {
              blocked: true,
              blockedCloseBrowser: true,
              showModal: false,
              confirm: false
            },
            onCommit,
            blockLocation: () => null,
            blockClosingBrowser: () => null,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    const errorMessage = await findByText(
      receiveETransferErrors.MSG_RBET_017Bs
    );
    await act(async () => {
      expect(errorMessage).toBeTruthy();
    });

    await act(async () => {
      expect(onCommit).toBeCalledTimes(0);
    });
  });

  it(">> Should continue blocking user from navigating away if `Back` button on modal is clicked", async () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {
              blocked: true,
              blockedCloseBrowser: true,
              showModal: true,
              confirm: false
            },
            onCommit: () => null,
            blockLocation: () => null,
            blockClosingBrowser: () => null,
            nextLocation: () => null,
            onCancel
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );
    await act(async () => {
      expect(getByText("Cancel deposit?")).toBeTruthy();
    });

    const modalBackButton = getByText("Back");
    await act(async () => {
      fireEvent.click(modalBackButton);
    });

    await act(async () => {
      expect(onCancel).toBeCalled();
    });
  });

  it(">> Should allow user to proceed with navigation if `Confirm` button on modal is clicked", async () => {
    const onCommit = jest.fn();
    const { getByText } = render(
      <RenderWithProviders location="/">
        <PromptContext.Provider
          value={{
            promptState: {
              blocked: true,
              blockedCloseBrowser: true,
              showModal: true,
              confirm: false
            },
            onCommit,
            blockLocation: () => null,
            blockClosingBrowser: () => null,
            nextLocation: () => null,
            onCancel: () => null
          }}
        >
          <ModalProvider>
            <ReceiveETransferContext.Provider
              value={{
                userProfile: { profile: { loading: false } },
                receiveETransfer: {
                  receiveEState: {
                    receiveMoneyData: {
                      senderName: "Hello Kitty",
                      beneficiaryMessage: "Receive me!",
                      eTransferSecurity: {
                        question: "What's my name?"
                      }
                    },
                    saving: false
                  },
                  authenticateTransfer: () => {}
                },
                acceptDeposit: {}
              }}
            >
              <ReceiveETransferForm />
            </ReceiveETransferContext.Provider>
          </ModalProvider>
        </PromptContext.Provider>
      </RenderWithProviders>
    );
    await act(async () => {
      expect(getByText("Cancel deposit?")).toBeTruthy();
    });

    const modalConfirmButton = getByText("Confirm");
    await act(async () => {
      fireEvent.click(modalConfirmButton);
    });

    await act(async () => {
      expect(onCommit).toBeCalledTimes(1);
    });
  });
});
