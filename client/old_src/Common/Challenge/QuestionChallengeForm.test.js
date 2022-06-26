import React from "react";
import { render, screen } from "@testing-library/react";
import {
  mockApiData,
  windowMatchMediaMock,
  RenderWithProviders
} from "utils/TestUtils";
import { authenticationErrors } from "utils/MessageCatalog";
import { mfaBaseUrl } from "api";

import QuestionChallengeForm from "./QuestionChallengeForm";

describe("Test Question Challenge Form", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });
  it(">> Should Render Question challenge for user to enter answer", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/questions`,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "What is this?" }]
        }
      }
    ]);
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <QuestionChallengeForm />
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    getByText("Security question");
  });
  it(">> Should call success callback when user enters in proper answer", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/questions`,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "What is this?" }]
        }
      },
      {
        url: `${mfaBaseUrl}/challenges/answers`,
        method: "POST",
        results: { challengeAnswer: "PASS" }
      }
    ]);

    const onSuccess = jest.fn();

    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <QuestionChallengeForm onSuccess={onSuccess} />
        </RenderWithProviders>
      );
    });
    const { getByText, getByLabelText } = screen;
    const input = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(input, {
        target: { value: "test" }
      });
    });

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onSuccess).toBeCalled();
  });
  it(">> Should display an error when the user enters an incorrect answer", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/questions`,
        results: {
          challengeQuestions: [{ id: 123, challengeQuestion: "What is this?" }]
        }
      },
      {
        url: `${mfaBaseUrl}/challenges/answers`,
        method: "POST",
        results: { challengeAnswer: "FAIL" }
      }
    ]);
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <QuestionChallengeForm />
        </RenderWithProviders>
      );
    });
    const { getByText, findByText, getByLabelText } = screen;
    const input = getByLabelText("Security answer");
    await act(async () => {
      fireEvent.change(input, {
        target: { value: "test" }
      });
    });
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = await findByText(authenticationErrors.MSG_RBAUTH_011);
    await act(async () => {
      expect(errorMessage).toBeTruthy();
    });
  });
  it(">> Should Render Question challenge with error modal if issues getting questions", async () => {
    mockApiData([
      {
        url: `${mfaBaseUrl}/challenges/questions`,
        error: "Error getting questions"
      }
    ]);
    await act(async () => {
      render(
        <RenderWithProviders location="/">
          <QuestionChallengeForm />
        </RenderWithProviders>
      );
    });

    const { findByText } = screen;
    const error = await findByText(/experiencing some technical issues/);
    expect(error).toBeTruthy();
  });
});
