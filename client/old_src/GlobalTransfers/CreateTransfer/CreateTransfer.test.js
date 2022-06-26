import React from "react";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderWithClient } from "utils/TestUtils";
import CreateTransfer from "./CreateTransfer";

describe("Global Transfers", () => {
  let render;

  beforeEach(() => {
    render = () =>
      renderWithClient(
        <MemoryRouter initialEntries={[`/move-money/global-transfers`]}>
          <CreateTransfer />
        </MemoryRouter>
      );
  });

  it("should show the stepper", async () => {
    render();

    expect(screen.getAllByText("Create")[0]).toBeVisible();
    expect(screen.getAllByText("Review")[0]).toBeVisible();
    expect(screen.getAllByText("Complete")[0]).toBeVisible();
  });
});
