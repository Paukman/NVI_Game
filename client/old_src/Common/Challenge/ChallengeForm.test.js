import React from "react";
import { act, render, screen } from "@testing-library/react";
import { MessageProvider } from "StyleGuide/Components";
import AntModalProvider from "StyleGuide/Components/Modal";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { mfaBaseUrl } from "api";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import ChallengeForm from "./ChallengeForm";
import { challengesURL } from "./useChallengeType";

const getPhones = (registered = true) => [
  {
    id: 123,
    name: "primary",
    default: true,
    defaultChallengeType: "SMSAuthentication",
    registeredForIvr: registered,
    registeredForSms: registered,
    number: "1231231234"
  }
];

const defaultProps = {
  rsaHeaders: { a: 1 },
  onChallengeTypeChange: jest.fn(),
  onSuccess: jest.fn(),
  onFailure: jest.fn()
};

const renderComponent = () =>
  render(
    <MessageProvider>
      <AntModalProvider>
        <ChallengeForm {...defaultProps} />
      </AntModalProvider>
    </MessageProvider>
  );

describe("Test ChallengeForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should render an Question challenge form when challenge type is ChallengeQuestion", async () => {
    const currentChallengeType = "ChallengeQuestion";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
      }
    ]);
    await act(async () => renderComponent());
    const { getByText } = screen;

    const questionChallenge = getByText(
      "For security purposes, please answer the following question:"
    );
    expect(questionChallenge).toBeVisible();
  });

  it(">> Should render an SMS challenge form when challenge type is not ChallengeQuestion and phone is registered", async () => {
    const currentChallengeType = "SMSAuthentication";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
      },
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: { phones: getPhones() }
      }
    ]);

    await act(async () => renderComponent());
    const { getByText } = screen;

    const smsChallenge = getByText(
      "To verify your identity, we'll send you a six-digit passcode to your mobile device."
    );
    expect(smsChallenge).toBeVisible();
  });

  it(">> Should always render an Question challenge form when exemptFromOutOfBandChallenges is true", async () => {
    const currentChallengeType = "SMSAuthentication";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType, exemptFromOutOfBandChallenges: true },
        method: "GET"
      }
    ]);
    await act(async () => renderComponent());
    const { getByText } = screen;

    const questionChallenge = getByText(
      "For security purposes, please answer the following question:"
    );
    expect(questionChallenge).toBeVisible();
  });

  it(">> Should render an Question challenge form when challenge type is not ChallengeQuestion and phone is not registered", async () => {
    const currentChallengeType = "SMSAuthentication";
    mockApiData([
      {
        url: challengesURL,
        results: { currentChallengeType },
        method: "GET"
      },
      {
        url: `${mfaBaseUrl}/challenges/phones`,
        results: { phones: getPhones(false) }
      }
    ]);
    await act(async () => renderComponent());
    const { getByText } = screen;

    const questionChallenge = getByText(
      "For security purposes, please answer the following question:"
    );
    expect(questionChallenge).toBeVisible();
  });

  it(">> Should render an Error message and try again button when the API fails", async () => {
    mockApiData([
      {
        url: challengesURL,
        error: 500,
        method: "GET"
      }
    ]);
    await act(async () => renderComponent());
    const { getByText } = screen;

    const errorMsg = getByText(mfaSecurityMessages.MSG_RB_AUTH_042);
    expect(errorMsg).toBeVisible();
    expect(getByText("Try again")).toBeVisible();
  });
});
