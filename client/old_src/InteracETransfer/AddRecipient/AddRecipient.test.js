import { RenderWithProviders } from "utils/TestUtils";
import React from "react";
import { render } from "@testing-library/react";
import AddRecipient from "./AddRecipient";
import { AddRecipientContext } from "./AddRecipientProvider";

const renderWithMockData = (
  form = null,
  onCancel = () => null,
  onFormFinish = () => null
) => {
  return (
    <RenderWithProviders location="/">
      <AddRecipientContext.Provider
        value={{
          addRecipient: {
            state: {
              formToRender: form
            },
            onCancel,
            onFormFinish
          }
        }}
      >
        <AddRecipient />
      </AddRecipientContext.Provider>
    </RenderWithProviders>
  );
};

describe("Test AddRecipien", () => {
  it(">> should render modal with form", () => {
    const { getByText, queryByText } = render(
      renderWithMockData(<div>Form to render</div>, null, null)
    );
    expect(queryByText("Add recipient")).toBeInTheDocument();
    expect(getByText("Form to render")).toBeDefined();
  });
});
