import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import InteracPrefProvider, {
  InteracPreferencesContext
} from "./InteracPrefProvider";

describe(">> InteracPrefProvider", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> the profile provider sholud render children ", async () => {
    let component;
    await act(async () => {
      component = render(
        <RenderWithProviders location="/">
          <InteracPrefProvider>
            <div />
          </InteracPrefProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the profile context exported and should render children ", async () => {
    const { container } = render(
      <InteracPreferencesContext.Provider>
        <div />
      </InteracPreferencesContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
