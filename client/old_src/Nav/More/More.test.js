import React from "react";
import { renderWithRouter } from "utils/TestUtils";
import More, { SubView } from "./More";

const BASE_PATH = "/more";

describe("More tests", () => {
  it(">> return null when there is no match", () => {
    const { container } = renderWithRouter(<More />, {
      route: `${BASE_PATH}/blah-blah`
    });
    expect(container.hasChildNodes()).toBe(false);
  });
  it(">> Should test manage-contacts", () => {
    const data = {
      match: {
        params: {
          sectionName: "manage-contacts"
        }
      }
    };

    const results = SubView(data);
    expect(results.type.name).toEqual("ManageContactsProvider");
  });

  it(">> Should test default", () => {
    const data = {
      match: {
        params: {
          sectionName: ""
        }
      }
    };
    const results = SubView(data);
    expect(results).toEqual(null);
  });
  it(">> Should test contact-us", () => {
    const data = {
      match: {
        params: {
          sectionName: "contact-us"
        }
      }
    };

    const results = SubView(data);
    expect(results.type.name).toEqual("ContactUs");
  });

  it(">> Should test privacy-and-security", () => {
    const data = {
      match: {
        params: {
          sectionName: "privacy-and-security"
        }
      }
    };

    const results = SubView(data);
    expect(results.type.name).toEqual("PrivacyAndSecurity");
  });
});
