import React from "react";

import Status from "./Status";

describe("Test Status Component", () => {
  it(">> Should Render properly mapped status with icon", async () => {
    const component = render(<Status status="Transfer Available" showIcon />);
    const { getByText, getByAltText } = component;
    expect(getByText("Sent")).toBeTruthy();
    expect(getByAltText("status")).toBeTruthy();
  });
  it(">> Should Render properly mapped status without icon", async () => {
    const component = render(<Status status="Declined" showIcon={false} />);
    const { getByText, queryByAltText } = component;
    expect(getByText("Cancelled")).toBeTruthy();
    expect(queryByAltText("status")).toBeNull();
  });
});
