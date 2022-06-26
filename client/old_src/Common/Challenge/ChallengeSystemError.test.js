import React from "react";
import { act, render, screen } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import ChallengeSystemError from "./ChallengeSystemError";

describe("ChallengeSystemError", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should render any passed in children", () => {
    render(<ChallengeSystemError>Any passed in children</ChallengeSystemError>);
    const { getByTestId, getByText } = screen;

    expect(getByTestId("challenge-system-error")).toBeVisible();
    expect(getByText("Any passed in children")).toBeVisible();
  });

  it(">> Should not render anything when no children are passed in", () => {
    render(<ChallengeSystemError />);
    const { queryByText } = screen;

    expect(queryByText("challenge-system-error")).not.toBeInTheDocument();
  });

  it(">> Should render a button that calls handleClick when provided", async () => {
    const handleClick = jest.fn();
    render(
      <ChallengeSystemError handleClick={handleClick}>
        Error message
      </ChallengeSystemError>
    );
    const { getByText } = screen;

    const tryAgainButton = getByText("Try again");
    await act(async () => {
      fireEvent.click(tryAgainButton);
    });

    expect(handleClick).toBeCalledTimes(1);
  });

  it(">> Should not render a button when no handleClick prop is provided", () => {
    render(<ChallengeSystemError>Error message</ChallengeSystemError>);
    const { getByTestId, queryByText } = screen;

    expect(getByTestId("challenge-system-error")).toBeVisible();
    expect(queryByText("Try again")).not.toBeInTheDocument();
  });
});
