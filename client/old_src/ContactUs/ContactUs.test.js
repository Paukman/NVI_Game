import React from "react";
import { render } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import ContactUs from "./index";

describe("> renders", () => {
  it(">> renders the component with correct qualtrics id", async () => {
    window.QSI = {
      API: {
        unload: jest.fn(),
        load: jest.fn(),
        run: jest.fn()
      }
    };
    windowMatchMediaMock();
    let container;
    await act(async () => {
      container = render(<ContactUs />);
    });
    expect(window.QSI.API.unload).toHaveBeenCalled();
    expect(window.QSI.API.load).toHaveBeenCalled();
    expect(window.QSI.API.run).toHaveBeenCalled();
    const { getByText } = container;
    const link = getByText("Get started");
    expect(link.id).toEqual("qualtrics-contactus");
  });
});
