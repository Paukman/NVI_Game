import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import AddPayeeProvider, { AddPayeeContext } from "./AddPayeeProvider";

describe(">> AddPayeeProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <AddPayeeProvider>
            <div />
          </AddPayeeProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the context is exported and should render children ", async () => {
    const { container } = render(
      <AddPayeeContext.Provider>
        <div />
      </AddPayeeContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
