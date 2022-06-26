import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import FulfillERequestProvider, {
  FulfillERequestContext
} from "./FulfillERequestProvider";

describe(">> ReceiveETransferProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> the profile provider should render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <FulfillERequestProvider>
            <div />
          </FulfillERequestProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the profile context exported and should render children ", async () => {
    const { container } = render(
      <FulfillERequestContext.Provider>
        <div />
      </FulfillERequestContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
