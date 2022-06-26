import React from "react";
import { render, act } from "@testing-library/react";
import SnackbarProvider, { SnackbarContext } from "./SnackbarProvider";

describe("SnackbarProvider hook", () => {
  it("can render children", async () => {
    let component;
    await act(async () => {
      component = render(
        <SnackbarProvider>
          <div />
        </SnackbarProvider>
      );
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
  it("can render children with context", async () => {
    let component;
    await act(async () => {
      component = render(
        <SnackbarContext.Provider value={{}}>
          <div />
        </SnackbarContext.Provider>
      );
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
});
