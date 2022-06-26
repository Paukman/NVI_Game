import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import BillPaymentProvider, { BillPaymentContext } from "./BillPaymentProvider";

describe(">> BillPaymentProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> the profile provider should render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <BillPaymentProvider>
            <div />
          </BillPaymentProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the profile context exported and should render children ", async () => {
    const { container } = render(
      <BillPaymentContext.Provider>
        <div />
      </BillPaymentContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
