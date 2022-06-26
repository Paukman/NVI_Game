import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { eTransferErrors, SYSTEM_ERROR } from "utils/MessageCatalog";
import FailedTransactionError from "./FailedTransactionError";

const defaultProps = {
  onClick: jest.fn()
};

const renderComponent = (props = {}) =>
  act(async () =>
    render(<FailedTransactionError {...defaultProps} {...props} />)
  );

describe("FailedTransactionError", () => {
  it(">> Should render a System error", async () => {
    await renderComponent();
    const { getByText, getByRole } = screen;

    const errorTitle = getByText(SYSTEM_ERROR);
    const errorMessage = getByText(eTransferErrors.MSG_REBAS_000_CONTENT);
    const errorButton = getByRole("button", { name: "OK" });

    expect(errorTitle).toBeVisible();
    expect(errorMessage).toBeVisible();
    expect(errorButton).toBeVisible();
  });

  it(">> Should fire `onClick` prop when button is clicked", async () => {
    const onClick = jest.fn();

    await renderComponent({ onClick });
    const { getByRole } = screen;

    const errorButton = getByRole("button", { name: "OK" });
    fireEvent.click(errorButton);

    expect(onClick).toBeCalledTimes(1);
  });
});
