import React from "react";
import { render, screen } from "@testing-library/react";
import OverflowEmail from "./OverflowEmail";

describe("Test OverflowEmail", () => {
  it(">> Should render any string passed in as children", () => {
    render(<OverflowEmail>non email string</OverflowEmail>);
    const { getByText, getByTestId } = screen;

    expect(getByText("non email string")).toBeVisible();
    expect(getByTestId("overflow-email")).toBeVisible();
    expect(getByTestId("email-name")).toBeVisible();
  });

  it(">> Should render an email string passed in two different spans", () => {
    render(<OverflowEmail>obi-wan-kenobi@high.ground</OverflowEmail>);
    const { getByTestId } = screen;

    expect(getByTestId("overflow-email")).toHaveTextContent(
      "obi-wan-kenobi@high.ground"
    );
    expect(getByTestId("email-name")).toHaveTextContent("obi-wan-kenobi");
    expect(getByTestId("email-domain")).toHaveTextContent("@high.ground");
  });

  it(">> Should render non-string children without any wrapper component", () => {
    render(
      <OverflowEmail>
        <p>a non-string child</p>
      </OverflowEmail>
    );
    const { getByText, queryByTestId } = screen;

    expect(getByText("a non-string child")).toBeVisible();
    expect(queryByTestId("overflow-email")).not.toBeInTheDocument();
  });
});
