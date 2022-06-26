import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import { ModalContext } from "Common/ModalProvider";
import ManageContactsProvider, {
  ManageContactsContext
} from "./ManageContactsProvider";

describe(">> ManageContactsProvider", () => {
  it(">> the manage contact provider sholud render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <ModalContext.Provider
            value={{
              show: () => null,
              hide: () => null,
              modalComponent: () => null
            }}
          >
            <ManageContactsProvider>
              <div />
            </ManageContactsProvider>
          </ModalContext.Provider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> it should render child components ", async () => {
    const { container } = render(
      <ManageContactsContext.Provider>
        <div />
      </ManageContactsContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
