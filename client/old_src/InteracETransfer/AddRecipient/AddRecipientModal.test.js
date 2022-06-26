import { RenderWithProviders } from "utils/TestUtils";
import React from "react";
import { render } from "@testing-library/react";
import AddRecipientModal from "./AddRecipientModal";
import { AddRecipientContext } from "./AddRecipientProvider";

const renderWithMockData = (form = null, onCancel = () => null) => {
  return (
    <RenderWithProviders location="/">
      <AddRecipientContext.Provider
        value={{
          addRecipient: {
            state: {
              formToRender: form
            },
            onCancel
          }
        }}
      >
        <AddRecipientModal />
      </AddRecipientContext.Provider>
    </RenderWithProviders>
  );
};

describe("Test AddRecipientModal", () => {
  it(">> should render form when passed in", () => {
    const { getByText, queryByText } = render(
      renderWithMockData(<div>Form to render</div>, null)
    );
    expect(queryByText("Add recipient")).toBeInTheDocument();
    expect(getByText("Form to render")).toBeDefined();
  });
  it(">> should not render if form not available", () => {
    const { queryByText } = render(renderWithMockData(null, null));
    expect(queryByText("Add recipient")).not.toBeInTheDocument();
  });
  it(">> should call on cancel when clicking on x", async () => {
    const onCancel = jest.fn();
    const { getByLabelText } = render(
      renderWithMockData(<div>Form to render</div>, onCancel)
    );
    const close = getByLabelText("Close");
    await act(async () => {
      fireEvent.click(close);
    });
    expect(onCancel).toBeCalled();
  });
});
