import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import { Grid } from "antd";
import DetailsCollapse from "./DetailsCollapse";

const renderComponent = (children = <p>Child element</p>) =>
  act(async () => render(<DetailsCollapse>{children}</DetailsCollapse>));

describe("DetailsCollapse", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should render all children at md or larger screen sizes", async () => {
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: true }));
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Child element")).toBeVisible();
  });

  it(">> Should not render collapse element at md or larger screen sizes", async () => {
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: true }));
    await renderComponent();
    const { queryByText } = screen;

    expect(queryByText("Account details")).not.toBeInTheDocument();
  });

  it(">> Should render collapse element at sm and xs screen sizes", async () => {
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: false }));
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Account details")).toBeVisible();
  });

  it(">> Should only show child elements after clicking collapse at sm and xs screen sizes", async () => {
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: false }));
    await renderComponent();
    const { getByText, queryByText } = screen;

    expect(queryByText("Child element")).not.toBeInTheDocument();

    const collapse = getByText("Account details");
    await act(async () => {
      fireEvent.click(collapse);
    });

    expect(getByText("Child element")).toBeVisible();
  });
});
