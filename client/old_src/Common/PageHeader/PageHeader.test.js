import React from "react";
import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it(">> Should render children", () => {
    render(<PageHeader>Child</PageHeader>);
    const { getByText } = screen;
    expect(getByText("Child")).toBeVisible();
  });

  it(">> Should render a loading skeleton while loading is true", () => {
    render(<PageHeader loading>Child</PageHeader>);
    const { getByTestId, queryByText } = screen;
    expect(getByTestId("page-header-skeleton")).toBeVisible();
    expect(queryByText("Child")).not.toBeInTheDocument();
  });
});
