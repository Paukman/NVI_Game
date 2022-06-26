import React from "react";
import { render, act } from "@testing-library/react";
import ModalProvider, { ModalContext } from "./ModalProvider";

describe("ModalProvider", () => {
  it("can render children", async () => {
    let component;
    await act(async () => {
      component = render(
        <ModalProvider>
          <div />
        </ModalProvider>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
  it("can render children with context", async () => {
    let component;
    await act(async () => {
      component = render(
        <ModalContext.Provider>
          <div />
        </ModalContext.Provider>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
});
