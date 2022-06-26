import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import ReceiveETransferProvider, {
  ReceiveETransferContext
} from "./ReceiveETransferProvider";

describe(">> ReceiveETransferProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> the profile provider should render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders show={() => null} location="/">
          <ReceiveETransferProvider>
            <div />
          </ReceiveETransferProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the profile context exported and should render children ", async () => {
    const { container } = render(
      <ReceiveETransferContext.Provider>
        <div />
      </ReceiveETransferContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
