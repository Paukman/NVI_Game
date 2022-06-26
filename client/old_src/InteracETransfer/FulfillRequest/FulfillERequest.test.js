import React from "react";
import { render, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  mockApiData,
  windowMatchMediaMock,
  RenderWithProviders
} from "utils/TestUtils";
import { accountsBaseUrl, etransfersBaseUrl, mfaBaseUrl } from "api";
import PromptProvider from "Common/PromptProvider";
import { MessageProvider } from "StyleGuide/Components";
import ModalProvider from "Common/ModalProvider";
import {
  eTransferLimitsPassing,
  interacProfilePassing,
  eligibleAccountsFromDataPassing,
  recipientsPassing
} from "../InteracETransfer.testdata";
import { fulfillRequest } from "./constants";
import { FulfillERequestContext } from "./FulfillERequestProvider";
import FulfillERequest from "./FulfillERequest";

const challengesURL = `${mfaBaseUrl}/challenges/user`;
const challengesAnswersURL = `${mfaBaseUrl}/challenges/answers`;
const challengesQuestionsURL = `${mfaBaseUrl}/challenges/questions`;

describe("testing ReceiveETransfer", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render loading interac profile component ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <FulfillERequestContext.Provider
            value={{
              userProfile: {
                profile: {
                  loading: true
                }
              }
            }}
          >
            <FulfillERequest id="some id" />
          </FulfillERequestContext.Provider>
        </RenderWithProviders>
      );
    });
    const { getByTestId } = component;
    expect(getByTestId("profile-loading")).toBeTruthy();
  });
  it(">> should render create interac profile page", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <FulfillERequestContext.Provider
            value={{
              userProfile: {
                profile: {
                  loading: false,
                  render: true
                }
              }
            }}
          >
            <FulfillERequest id="some id" />
          </FulfillERequestContext.Provider>
        </RenderWithProviders>
      );
    });
    const { getByText } = component;
    expect(getByText(/Your profile lets/)).toBeTruthy();
  });
  it(">> Should show rsa modal for RSA challanged user and successful RSA response", async () => {
    windowMatchMediaMock();
    const currentChallengeType = "ChallengeQuestion";
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
        url: `${mfaBaseUrl}/challenges/user`,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${etransfersBaseUrl}/incomingmoneyrequest/success`,
        results: fulfillRequest,
        status: 200,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/`,
        method: "POST",
        status: 230,
        results: {
          deviceTokenCookie: "",
          sessionId: "123",
          transactionId: ""
        }
      },
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
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
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter location="/">
          <MessageProvider>
            <PromptProvider>
              <ModalProvider>
                <FulfillERequestContext.Provider
                  value={{
                    userProfile: {
                      profile: {
                        loading: false,
                        render: false
                      }
                    }
                  }}
                >
                  <FulfillERequest id="success" />
                </FulfillERequestContext.Provider>
              </ModalProvider>
            </PromptProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, getByLabelText, findByText } = component;

    // select withdrawal
    const selectItem = getByText("Basic Account (4779) | $49,984.01");

    await act(async () => {
      fireEvent.click(selectItem);
      const fulfillButton = getByText("Fulfill");
      fireEvent.click(fulfillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
      const submit = getByText("Submit");
      fireEvent.click(submit);
    });
    expect(
      getByText(
        "You’ve successfully fulfilled a request for money by Interac e-Transfer."
      )
    ).toBeVisible();
  });
  it(">> rsa modal with failed RSA response", async () => {
    windowMatchMediaMock();
    const currentChallengeType = "ChallengeQuestion";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
      },
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
        url: `${etransfersBaseUrl}/incomingmoneyrequest/success`,
        results: fulfillRequest,
        status: 200,
        method: "GET"
      },
      {
        url: `${mfaBaseUrl}/challenges/user`,
        results: {
          currentChallengeType: "ChallengeQuestion"
        }
      },
      {
        url: `${etransfersBaseUrl}/`,
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
        url: challengesAnswersURL,
        method: "POST",
        results: { challengeAnswer: "FAILED" }
      }
    ]);
    let component;
    await act(async () => {
      component = render(
        <MemoryRouter location="/">
          <MessageProvider>
            <PromptProvider>
              <ModalProvider>
                <FulfillERequestContext.Provider
                  value={{
                    userProfile: {
                      profile: {
                        loading: false,
                        render: false
                      }
                    }
                  }}
                >
                  <FulfillERequest id="success" />
                </FulfillERequestContext.Provider>
              </ModalProvider>
            </PromptProvider>
          </MessageProvider>
        </MemoryRouter>
      );
    });
    const { getByText, getByLabelText, queryByText, findByText } = component;

    // select withdrawal
    const selectItem = getByText("Basic Account (4779) | $49,984.01");

    await act(async () => {
      fireEvent.click(selectItem);
      const fulfillButton = getByText("Fulfill");
      fireEvent.click(fulfillButton);
    });

    expect(
      await findByText(
        "For security purposes, please answer the following question:"
      )
    ).toBeVisible();

    const securityAnswerInput = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(securityAnswerInput, {
        target: { value: "car" }
      });
      const submit = getByText("Submit");
      fireEvent.click(submit);
    });

    expect(
      queryByText(
        "You’ve successfully fulfilled a request for money by Interac e-Transfer."
      )
    ).toBeFalsy();
  });
});
