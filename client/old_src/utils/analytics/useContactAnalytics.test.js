import mixpanel from "mixpanel-browser";
import * as Jotai from "jotai";
import useContactAnalytics, { contactType } from "./useContactAnalytics";

jest.mock("mixpanel-browser");

describe("useContactAnalytics hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks if contactAdded calls mixpanel correctly", () => {
    // mock mixpanel
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    const setNavLocation = jest.fn();
    jest.spyOn(Jotai, "useAtom").mockReturnValue(["test", setNavLocation]);

    const contactAnalytics = useContactAnalytics();
    contactAnalytics.contactAdded(contactType.RECIPIENT);

    expect(mixpanelTrack).toBeCalledTimes(1);
    expect(mixpanelTrack).toBeCalledWith(
      expect.stringContaining("Contact Added"),
      expect.objectContaining({
        contactType: expect.stringContaining("Recipient"),
        addLocation: "test"
      })
    );
  });

  it("checks if contactRemoved calls mixpanel correctly", () => {
    // mock mixpanel
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    const setNavLocation = jest.fn();
    jest.spyOn(Jotai, "useAtom").mockReturnValue(["test", setNavLocation]);

    const contactAnalytics = useContactAnalytics();
    contactAnalytics.contactRemoved(contactType.PAYEE);

    expect(mixpanelTrack).toBeCalledTimes(1);
    expect(mixpanelTrack).toBeCalledWith(
      expect.stringContaining("Contact Removed"),
      expect.objectContaining({
        contactType: expect.stringContaining("Payee"),
        addLocation: "test"
      })
    );
  });
});
