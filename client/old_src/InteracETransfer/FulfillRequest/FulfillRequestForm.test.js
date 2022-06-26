import React from "react";
import { render, act, screen } from "@testing-library/react";
import {
  fulfillRequest,
  fulfillRequestBusiness
} from "InteracETransfer/FulfillRequest/constants";
import { RenderWithProviders } from "utils/TestUtils";
import PromptProvider from "Common/PromptProvider";
import { eTransferDataMock } from "../validatorsTestData";

import FulfillRequestForm from "./FulfillRequestForm";

const props = {
  requestData: fulfillRequest,
  eTransferData: eTransferDataMock,
  submitForm: jest.fn()
};

describe("Fulfill E-Transfer Request Tests", () => {
  it(">> it should render elements", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...props} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByText, queryByText } = screen;

    expect(getByText("Requester")).toBeTruthy();
    expect(getByText("Requested amount")).toBeTruthy();
    expect(getByText("Message from requester")).toBeTruthy();
    expect(getByText("Expiration date")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(getByText("Message (optional)")).toBeTruthy();
    expect(queryByText("Invoice number")).toBeNull();
    expect(queryByText("Invoice due")).toBeNull();
  });

  it(">> it should render elements for business requester", async () => {
    const businessProps = {
      ...props,
      requestData: fulfillRequestBusiness
    };
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...businessProps} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText("Requester")).toBeTruthy();
    expect(getByText("Requested amount")).toBeTruthy();
    expect(getByText("Message from requester")).toBeTruthy();
    expect(getByText("Expiration date")).toBeTruthy();
    expect(getByText("Invoice number")).toBeTruthy();
    expect(getByText("Invoice due")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(getByText("Message (optional)")).toBeTruthy();
  });

  it(">> it should show the proper name for a retail requester", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...props} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText("Ariel Wheeler (testing123456@atb.com)")).toBeTruthy();
  });

  it(">> it should show the proper name for a business requester", async () => {
    const businessProps = {
      ...props,
      requestData: fulfillRequestBusiness
    };
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...businessProps} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText("Company User (testing123456@atb.com)")).toBeTruthy();
  });

  it(">> it should show the proper invoice number for business requester", async () => {
    const businessProps = {
      ...props,
      requestData: fulfillRequestBusiness
    };
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...businessProps} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByText } = screen;
    expect(getByText("123456")).toBeTruthy();
  });

  it(">> it should hide the requester message if it is null", async () => {
    const propsNullMessage = {
      ...props,
      requestData: { ...props.requestData, beneficiaryMessage: null }
    };
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...propsNullMessage} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { queryByText } = screen;
    expect(queryByText("Message from requester")).toBeNull();
  });

  it(">> it should update message counter", async () => {
    await act(async () => {
      render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <PromptProvider>
            <FulfillRequestForm {...props} />
          </PromptProvider>
        </RenderWithProviders>
      );
    });
    const { getByTestId, getByText } = screen;
    expect(getByText("0/400")).toBeTruthy();
    const messageTextArea = getByTestId("message-textarea");
    await act(async () => {
      fireEvent.change(messageTextArea, { target: { value: "testing" } });
    });

    expect(getByText("7/400")).toBeTruthy();

    await act(async () => {
      fireEvent.change(messageTextArea, { target: { value: null } });
    });

    expect(getByText("0/400")).toBeTruthy();
  });

  it(">> it should display an error if the from account isn't selected", async () => {
    const { getByText } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <PromptProvider>
          <FulfillRequestForm {...props} />
        </PromptProvider>
      </RenderWithProviders>
    );
    const button = getByText("Fulfill");
    await act(async () => {
      button.click();
    });

    expect(getByText("Select an account.")).toBeTruthy();
  });

  it(">> it should call the passed in submit function when the form is submitted", async () => {
    const { getByText } = render(
      <RenderWithProviders location="/" modalComponent={() => null}>
        <PromptProvider>
          <FulfillRequestForm {...props} />
        </PromptProvider>
      </RenderWithProviders>
    );

    // select withdrawal
    await act(async () => {
      fireEvent.click(getByText("Basic Account (4779) | $44,993.65"));
    });

    const button = getByText("Fulfill");
    await act(async () => {
      button.click();
    });

    expect(props.submitForm).toBeCalled();
  });
});
