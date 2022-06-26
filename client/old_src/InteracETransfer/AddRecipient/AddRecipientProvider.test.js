import React from "react";
import { render, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import AntModalProvider from "StyleGuide/Components/Modal/AntModalProvider";
import AddRecipientProvider, {
  AddRecipientContext
} from "./AddRecipientProvider";

describe(">> AddRecipientProvider tests", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> should render children ", async () => {
    let component;
    const handleAddRecipient = jest.fn();
    const showAddRecipient = jest.fn();
    await act(async () => {
      component = render(
        <RenderWithProviders location="/" modalComponent={() => null}>
          <AntModalProvider>
            <AddRecipientProvider
              showAddRecipient={showAddRecipient}
              handleAddRecipient={handleAddRecipient}
            >
              <div />
            </AddRecipientProvider>
          </AntModalProvider>
        </RenderWithProviders>
      );
      return component;
    });
    expect(component.container.hasChildNodes()).toBe(true);
  });

  it(">> the context is exported and should render children ", async () => {
    const { container } = render(
      <AddRecipientContext.Provider>
        <div />
      </AddRecipientContext.Provider>
    );
    expect(container.hasChildNodes()).toBe(true);
  });
});
