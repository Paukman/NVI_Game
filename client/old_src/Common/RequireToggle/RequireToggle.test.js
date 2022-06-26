import React from "react";
import { act, render, screen } from "@testing-library/react";
import { mockApiData } from "utils/TestUtils";
import { featureToggleBaseUrl } from "api";
import RequireToggle from "./RequireToggle";

const { getByText, queryByText } = screen;
const child = "A Child";
const renderComponent = toggle =>
  render(
    <RequireToggle toggle={toggle}>
      <div>A Child</div>
    </RequireToggle>
  );

describe("Test RequireToggle", () => {
  beforeAll(() => {
    mockApiData([
      {
        url: `${featureToggleBaseUrl}/has-dev-toggle`,
        results: { status: true }
      },
      {
        url: `${featureToggleBaseUrl}/no-dev-toggle`,
        results: { status: false }
      }
    ]);
  });

  it(">> Should render no children when toggle unknown", async () => {
    await act(async () => renderComponent("unknown-dev-toggle"));
    expect(queryByText(child)).not.toBeInTheDocument();
  });

  it(">> Should render no children when toggle off", async () => {
    await act(async () => renderComponent("no-dev-toggle"));
    expect(queryByText(child)).not.toBeInTheDocument();
  });

  it(">> Should render the children when toggle on", async () => {
    await act(async () => renderComponent("has-dev-toggle"));
    expect(getByText(child)).toBeVisible();
  });
});
