import React from "react";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithClient } from "utils/TestUtils";
import GlobalTransfers from "./GlobalTransfers";

describe("Global Transfers", () => {
  it("should set the 'Create new transfer' tab to active by default", () => {
    // Tests whether the class on the div updates (CSS color change)
    renderWithClient(
      <MemoryRouter initialEntries={[`/move-money/global-transfers`]}>
        <GlobalTransfers />
      </MemoryRouter>
    );

    const tab = screen.getByText("Create new transfer").closest("div");
    expect(tab).toHaveClass("active");
  });
});
