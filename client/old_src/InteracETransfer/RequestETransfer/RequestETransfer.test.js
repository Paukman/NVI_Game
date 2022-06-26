import mixpanel from "mixpanel-browser";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import {
  render,
  act,
  findAllByRole,
  fireEvent,
  screen
} from "@testing-library/react";

import { accountsBaseUrl, etransfersBaseUrl, mfaBaseUrl } from "api";
import ModalProvider from "Common/ModalProvider";
import AntModalProvider from "StyleGuide/Components/Modal/AntModalProvider";
import { MessageProvider } from "StyleGuide/Components";

import { eTransferErrors } from "utils/MessageCatalog";
import { mockApiData } from "utils/TestUtils";
import {
  eTransferLimitsPassing,
  interacProfilePassing,
  eligibleAccountsFromDataPassing,
  recipientsPassing
} from "./utils.testdata";

import RequestETransfer from "./RequestETransfer";
import ETransferProvider from "../ETransferProvider";

jest.mock("mixpanel-browser");

const renderComponent = () =>
  act(async () =>
    render(
      <MemoryRouter initialEntries={["/"]}>
        <MessageProvider>
          <AntModalProvider>
            <ModalProvider>
              <ETransferProvider>
                <RequestETransfer />
              </ETransferProvider>
            </ModalProvider>
          </AntModalProvider>
        </MessageProvider>
      </MemoryRouter>
    )
  );
const challengesAnswersURL = `${mfaBaseUrl}/challenges/answers`;
const challengesQuestionsURL = `${mfaBaseUrl}/challenges/questions`;

describe("Request ETransfer", () => {
  beforeEach(() => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      }
    ]);
  });
  it("request money without RSA", async () => {
    window.QSI = {
      API: {
        unload: jest.fn(),
        load: jest.fn(),
        run: jest.fn()
      }
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/`,
        method: "POST",
        status: 201,
        results: {
          confirmationId: "CA1MRVADeNMg"
        }
      }
    ]);

    await renderComponent();

    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText
    } = screen;
    //
    // fill in form
    //

    // fill in contact
    const contacts = await findByTestId("dropdown-contact");
    const contactOptions = await findAllByRole(contacts, "option");
    await act(async () => {
      fireEvent.click(contactOptions[2]); // add-recipient added
    });
    expect(contacts.children[1].textContent).toBe(
      "Bob-Jackson (faketesting@atb.com)"
    );

    // fill in deposit to account
    const accounts = getByTestId("dropdown-to-account");
    const accountOptions = await findAllByRole(accounts, "option");
    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "Basic Account (4779) | $49,984.01"
    );

    // fill in amount field
    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // move to the review page
    const submitButton = getByText("Next");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm send request
    const sendRequestButton = await findByText("Send");
    expect(sendRequestButton).toBeDefined();
    await act(async () => {
      fireEvent.click(sendRequestButton);
    });

    // validate success message
    const sendAnother = getByText("Send another request");
    expect(sendAnother).toBeDefined();
  });

  it("request money with RSA SUCCESS", async () => {
    window.QSI = {
      API: {
        unload: jest.fn(),
        load: jest.fn(),
        run: jest.fn()
      }
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: `${challengesQuestionsURL}`,
        method: "GET",
        results: {
          challengeQuestions: [
            {
              challengeQuestionId: 123,
              challengeQuestion: "favorite car"
            }
          ]
        }
      },
      {
        url: `${challengesAnswersURL}`,
        method: "POST",
        results: {
          challengeAnswer: "PASS",
          transactionToken: 123
        }
      }
    ]);

    await renderComponent();

    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText
    } = screen;

    //
    // fill in form
    //

    // fill in contact
    const contacts = await findByTestId("dropdown-contact");
    const contactOptions = await findAllByRole(contacts, "option");
    await act(async () => {
      fireEvent.click(contactOptions[2]);
    });
    expect(contacts.children[1].textContent).toBe(
      "Bob-Jackson (faketesting@atb.com)"
    );

    // fill in deposit to account
    const accounts = getByTestId("dropdown-to-account");
    const accountOptions = await findAllByRole(accounts, "option");
    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "Basic Account (4779) | $49,984.01"
    );

    // fill in amount field
    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // move to the review page
    const submitButton = getByText("Next");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm send request
    const sendRequestButton = await findByText("Send");
    expect(sendRequestButton).toBeDefined();
    await act(async () => {
      fireEvent.click(sendRequestButton);
    });
  });

  it("request money with RSA FAILURE", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      },
      {
        url: `/api/atb-rebank-api-etransfers/outgoingmoneyrequest/create/`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: `${challengesQuestionsURL}`,
        method: "GET",
        results: {
          challengeQuestions: [
            {
              challengeQuestionId: 123,
              challengeQuestion: "favorite car"
            }
          ]
        }
      },
      {
        url: `${challengesAnswersURL}`,
        method: "POST",
        results: {
          challengeAnswer: "FAIL"
        }
      }
    ]);

    await renderComponent();

    const {
      getByTestId,
      findByTestId,
      findByPlaceholderText,
      getByText,
      findByText
    } = screen;

    //
    // fill in form
    //

    // fill in contact
    const contacts = await findByTestId("dropdown-contact");
    const contactOptions = await findAllByRole(contacts, "option");
    await act(async () => {
      fireEvent.click(contactOptions[2]);
    });
    expect(contacts.children[1].textContent).toBe(
      "Bob-Jackson (faketesting@atb.com)"
    );

    // fill in deposit to account
    const accounts = getByTestId("dropdown-to-account");
    const accountOptions = await findAllByRole(accounts, "option");
    await act(async () => {
      fireEvent.click(accountOptions[0]);
    });
    expect(accounts.children[1].textContent).toBe(
      "Basic Account (4779) | $49,984.01"
    );

    // fill in amount field
    const amount = await findByPlaceholderText("$");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amount, { target: { value: "$100.00" } });
    });
    expect(amount.value).toEqual("$100.00");

    // move to the review page
    const submitButton = getByText("Next");
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // confirm send request
    const sendRequestButton = await findByText("Send");
    expect(sendRequestButton).toBeDefined();
    await act(async () => {
      fireEvent.click(sendRequestButton);
    });
  });

  // this test is verifying onFormFinish is calling autodeposit registered API
  it("should verify autodeposit registered account failed API", async () => {
    await renderComponent();

    const { findByTestId, queryByText, findByLabelText, getAllByText } = screen;

    const contacts = await findByTestId("dropdown-contact");
    const contactOptions = await findAllByRole(contacts, "option");
    await act(async () => {
      fireEvent.click(contactOptions[0]); // add recipient
    });

    const recipientName = await findByLabelText("Recipient name");
    await act(async () => {
      fireEvent.change(recipientName, {
        target: { value: "My name" }
      });
    });

    const recipientEmail = await findByLabelText("Recipient email");
    await act(async () => {
      fireEvent.change(recipientEmail, {
        target: { value: "my@email.com" }
      });
    });

    const submitButtons = getAllByText("Next");
    await act(async () => {
      fireEvent.click(submitButtons[1]);
    });

    const error = queryByText(eTransferErrors.MSG_REBAS_000_CONTENT);
    expect(error).toBeInTheDocument();
  });

  it(">> should display system error for GET call failures", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: null,
        status: 500,
        method: "GET"
      }
    ]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <MessageProvider>
            <AntModalProvider>
              <ModalProvider>
                <ETransferProvider>
                  <RequestETransfer />
                </ETransferProvider>
              </ModalProvider>
            </AntModalProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });

    const { queryByText } = screen;

    const error = queryByText(eTransferErrors.MSG_REBAS_000_CONTENT);
    expect(error).toBeInTheDocument();
  });

  it("should start move money analytics on mount", async () => {
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    await renderComponent();

    expect(mixpanelTrack).toBeCalledWith("Money Movement Started", {
      transferType: "e-Transfer request"
    });
  });
});
