import React from "react";
import { render, act } from "@testing-library/react";
import SuccessMessage from "./SnackbarProvider";

describe("SuccessMessage", () => {
  it("can render children", async () => {
    let component;
    await act(async () => {
      component = render(
        <SuccessMessage>
          <div />
        </SuccessMessage>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });
});
