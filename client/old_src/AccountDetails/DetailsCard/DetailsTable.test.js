import React from "react";
import { act, render, screen } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import { Grid } from "antd";
import DetailsTable from "./DetailsTable";

const rightTable = {
  title: "Right table",
  data: [{ label: "Right label", value: "Right value" }]
};
const leftTable = {
  title: "Left table",
  data: [{ label: "Left label", value: "Left value" }]
};

const defaultProps = { rightTable, leftTable };

const renderComponent = (props = {}) =>
  act(async () => render(<DetailsTable {...defaultProps} {...props} />));

describe("DetailsTable", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: true }));
  });

  it(">> Should render all passed in tables", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Right table")).toBeVisible();
    expect(getByText("Right label")).toBeVisible();
    expect(getByText("Right value")).toBeVisible();
    expect(getByText("Left table")).toBeVisible();
    expect(getByText("Left label")).toBeVisible();
    expect(getByText("Left value")).toBeVisible();
  });

  it(">> Should render a full-width header when right table has no title", async () => {
    await renderComponent({ rightTable: { ...rightTable, title: undefined } });
    const { getByTestId, getByText } = screen;

    const right = getByTestId("detail-table-right").firstChild;

    expect(right).toHaveClass("full-width-table-header");
    expect(getByText("Left label")).toBeVisible();
    expect(getByText("Left value")).toBeVisible();
    expect(getByText("Right label")).toBeVisible();
    expect(getByText("Right value")).toBeVisible();
  });

  it(">> Should always hide left table bottom border when no right table exists", async () => {
    await renderComponent({ rightTable: undefined });
    const { getByTestId } = screen;
    const left = getByTestId("detail-table-left").firstChild;

    expect(left).toHaveClass("hide-bottom-border--desktop");
    expect(left).toHaveClass("hide-bottom-border--mobile");
  });

  it(">> Should always hide right table bottom border on mobile when right table exists", async () => {
    await renderComponent();
    const { getByTestId } = screen;
    const right = getByTestId("detail-table-right").firstChild;

    expect(right).toHaveClass("hide-bottom-border--mobile");
  });

  it(">> Should hide bottom border of longer table at desktop", async () => {
    const longLeftTable = {
      title: "Long left table",
      data: [
        ...leftTable.data,
        { label: "Left label 2", value: "Left value 2" }
      ]
    };
    await renderComponent({ leftTable: longLeftTable });
    const { getByTestId } = screen;
    const left = getByTestId("detail-table-left").firstChild;
    const right = getByTestId("detail-table-right").firstChild;

    expect(left).toHaveClass("hide-bottom-border--desktop");
    expect(right).not.toHaveClass("hide-bottom-border--desktop");
  });

  it(">> Should hide bottom border of both tables at desktop when they are the same length", async () => {
    await renderComponent();
    const { getByTestId } = screen;
    const left = getByTestId("detail-table-left").firstChild;
    const right = getByTestId("detail-table-right").firstChild;

    expect(left).toHaveClass("hide-bottom-border--desktop");
    expect(right).toHaveClass("hide-bottom-border--desktop");
  });
});
