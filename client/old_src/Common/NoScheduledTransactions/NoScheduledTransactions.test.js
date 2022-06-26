import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NoScheduledTransactions from "./NoScheduledTransactions";

const data = {
  message: "Test Message",
  url: "Test URL",
  buttonAria: "Test Aria",
  buttonName: "Test Button Name"
};

describe("Testing No Scheduled Transactions", () => {
  it(">> should render text", () => {
    const { getByText } = render(
      <MemoryRouter>
        <NoScheduledTransactions data={data} />
      </MemoryRouter>
    );

    expect(getByText(data.message)).toBeTruthy();
    expect(getByText(data.buttonName)).toBeTruthy();
  });
});
