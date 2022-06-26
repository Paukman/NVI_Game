import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import AntModalProvider from "StyleGuide/Components/Modal/AntModalProvider";
import ETransferProvider, { ETransferContext } from "./ETransferProvider";

describe(">> ETransferProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <AntModalProvider>
            <ETransferProvider>
              <div />
            </ETransferProvider>
          </AntModalProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the context is exported and should render children ", async () => {
    const { container } = render(
      <ETransferContext.Provider>
        <div />
      </ETransferContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
