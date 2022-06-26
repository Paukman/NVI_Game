import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuickAction from "./QuickAction";

const defaultProps = {
  id: "id",
  label: "My test label",
  icon: "path/to/icon.svg",
  redirectTo: { pathname: "/test-path" }
};

describe("QuickAction", () => {
  it(">> Should render given label and icon", () => {
    render(
      <MemoryRouter>
        <QuickAction {...defaultProps} />
      </MemoryRouter>
    );
    const { getByAltText, getByText } = screen;

    expect(getByText("My test label")).toBeVisible();
    expect(getByAltText("My test label")).toBeVisible();
  });
});
