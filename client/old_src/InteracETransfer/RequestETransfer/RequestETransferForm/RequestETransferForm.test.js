import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { requestETransferErrors } from "utils/MessageCatalog";
import { formatIconSrc } from "utils/TestUtils";
import RequestETransferForm from "./index";
import { eTransferDataMock } from "./constants";
import { ETransferContext } from "../../ETransferProvider";

const defaultProps = {
  id: "transfer",
  eTransferData: eTransferDataMock,
  setRequestETransferSubmit: () => {},
  nextTab: () => {},
  persistedData: {},
  setFormData: {}
};

const renderWithMockData = (props = defaultProps) => (
  <ETransferContext.Provider
    value={{
      request: {
        requestState: {},
        onChange: () => {}
      }
    }}
  >
    <RequestETransferForm {...props} />
  </ETransferContext.Provider>
);

describe("Request eTransfer tests", () => {
  it(">> should show a skeleton while eTransferData is loading.", () => {
    const { getByTestId } = render(
      renderWithMockData({
        ...defaultProps,
        eTransferData: { ...eTransferDataMock, loading: true }
      })
    );

    const skeleton = getByTestId("request-etransfer-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> it should render elements", async () => {
    const { container } = render(renderWithMockData());
    expect(container.querySelector("#transfer-from-label").innerHTML).toEqual(
      "Request from"
    );

    const fromIcon = container.querySelector("#transfer-from-icon");
    expect(formatIconSrc(fromIcon.src)).toEqual("/person.svg");
    expect(container.querySelector("#transfer-from-select").toExist);

    const downArowIcon = container.querySelector("#transfer-down-arrow-icon");
    expect(formatIconSrc(downArowIcon.src)).toEqual("/arrow_down.svg");

    expect(container.querySelector("#transfer-to-label").innerHTML).toEqual(
      "Deposit account"
    );

    const toIcon = container.querySelector("#transfer-to-icon");
    expect(formatIconSrc(toIcon.src)).toEqual("/account.svg");

    expect(container.querySelector("#transfer-to-select").toExist);

    expect(
      container.querySelector("#transfer-message-label").innerHTML
    ).toEqual("Message (optional)");

    const messageIcon = container.querySelector("#transfer-message-icon");
    expect(formatIconSrc(messageIcon.src)).toEqual("/message.svg");
  });

  it(">> it should update the Message counter", async () => {
    const { container } = render(renderWithMockData());

    const messageCounter = container.querySelector("#transfer-memo-counter");
    expect(messageCounter.innerHTML).toEqual("0/400");
    const messageTextArea = container.querySelector("#transfer-memo-textarea");
    await act(async () => {
      fireEvent.change(messageTextArea, { target: { value: "hey!" } });
    });
    expect(messageCounter.innerHTML).toEqual("4/400");
  });

  it(">> it should able to select contact from request from ", async () => {
    const { container, getByText } = render(renderWithMockData());

    const requestFromSelectText = container.querySelector(
      "#transfer-from-select > div.default.text"
    );
    expect(requestFromSelectText.innerHTML).toEqual("Select contact");
    const requestFromDropdownIcon = container.querySelector(
      "#transfer-from-select > i"
    );
    requestFromDropdownIcon.click();

    await act(async () => {
      fireEvent.click(getByText("abc (def@atb.com)"));
    });
    expect(requestFromSelectText.innerHTML).toEqual("abc (def@atb.com)");

    // Commented Out/Supressed on REB-3515
    // const editContact = container.querySelector("#transfer-edit-contact");
    // expect(editContact.innerHTML).toEqual("Edit contact");
  });

  it(">> it should able select account from Deposit account list", async () => {
    const { container } = render(renderWithMockData());

    const depositAccountSelectText = container.querySelector(
      "#transfer-to-select > div.default.text"
    );
    expect(depositAccountSelectText.innerHTML).toEqual("Select account");
    const depositAccountDropdownIcon = container.querySelector(
      "#transfer-to-select > i"
    );

    await act(async () => {
      depositAccountDropdownIcon.click();
    });
    const firstAccount = container.querySelector(
      "#transfer-to-select > div.visible.menu.transition > div:nth-child(1) > span"
    );
    await act(async () => {
      firstAccount.click();
    });

    expect(depositAccountSelectText.innerHTML).toEqual(
      "Basic Account (4779) | $44,993.65"
    );
  });

  it(">> it should not allow negative values for currency", async () => {
    const { container } = render(renderWithMockData());

    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "-4.12" } });
    });
    const positiveAmount = container.querySelector("#transfer-amount-input");
    expect(positiveAmount.value).toEqual("");
  });

  it(">> it should format Amount Currency", async () => {
    const { container } = render(renderWithMockData());
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: "1234.12" } });
    });
    expect(amount.value).toEqual("1234.12");
  });
});

describe("Request eTransfer from validation tests", () => {
  it(">> should render error message when contact is missing", async () => {
    const { container } = render(renderWithMockData());
    const button = container.querySelector("#transfer-form-submit-button");
    await act(async () => {
      button.click();
    });
    const fromSelectError = container.querySelector("#from-error");
    expect(fromSelectError.innerHTML).toEqual("Select a contact.");
  });

  it(">> should render error message when deposit account is missing", async () => {
    const { container } = render(renderWithMockData());
    const button = container.querySelector("#transfer-form-submit-button");
    await act(async () => {
      button.click();
    });

    const fromSelectError = container.querySelector("#to-error");
    expect(fromSelectError.innerHTML).toEqual("Select an account.");
  });

  it(">> should render error message when amount is missing", async () => {
    const { container } = render(renderWithMockData());
    const button = container.querySelector("#transfer-form-submit-button");

    await act(async () => {
      button.click();
    });
    const fromSelectError = container.querySelector("#amount-error");
    expect(fromSelectError.innerHTML).toEqual(
      requestETransferErrors.MSG_RBET_012C
    );
  });

  it(">> should remove error messages when contact, deposit and amount are selected", async () => {
    const { container, getByText } = render(renderWithMockData());
    const button = container.querySelector("#transfer-form-submit-button");
    await act(async () => {
      button.click();
    });

    const fromSelectError = container.querySelector("#from-error");
    expect(fromSelectError.innerHTML).toEqual(
      requestETransferErrors.MSG_RBET_007B
    );
    const toSelectError = container.querySelector("#to-error");
    expect(toSelectError.innerHTML).toEqual(
      requestETransferErrors.MSG_RBET_002
    );
    const amountSelectError = container.querySelector("#amount-error");
    expect(amountSelectError.innerHTML).toEqual(
      requestETransferErrors.MSG_RBET_012C
    );

    await act(async () => {
      fireEvent.click(getByText("abc (def@atb.com)"));
    });

    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });

    const amount = container.querySelector("#transfer-amount-input");

    await act(async () => {
      fireEvent.change(amount, { target: { value: "26" } });
    });

    expect(fromSelectError.innerHTML).toEqual("");
    expect(toSelectError.innerHTML).toEqual("");
    expect(amountSelectError.innerHTML).toEqual("");
  });

  it(">> should show and remove MSG_RBET_012 message for the amount outside and inside the request range", async () => {
    const { container } = render(renderWithMockData());
    const amount = container.querySelector("#transfer-amount-input");
    await act(async () => {
      fireEvent.change(amount, { target: { value: 3000.01 } });
    });
    const amountSelectError = container.querySelector("#amount-error");
    expect(amountSelectError.innerHTML).toEqual(
      "Enter an amount between $0.01 and $3,000.00."
    );

    await act(async () => {
      fireEvent.change(amount, { target: { value: 2999.99 } });
    });
    expect(amountSelectError.innerHTML).toEqual("");
  });
});
