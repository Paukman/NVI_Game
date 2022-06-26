import React from "react";
import { render } from "@testing-library/react";
import PrivacyAndSecurity from "./index";

describe("> renders", () => {
  it(">> renders the component", async () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }));
    let container;
    await act(async () => {
      container = render(<PrivacyAndSecurity />);
    });
    const { getByText } = container;
    const linkPrivacyCode = getByText("Read our privacy code");
    expect(linkPrivacyCode.href).toEqual(
      "https://www.atb.com/company/privacy-and-security"
    );
    const linkGuarantee = getByText("Read our guarantee");
    expect(linkGuarantee.href).toEqual(
      "https://www.atb.com/company/privacy-and-security/online-guarantee"
    );
  });
});
