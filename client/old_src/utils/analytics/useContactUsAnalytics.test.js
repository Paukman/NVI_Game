import mixpanel from "mixpanel-browser";
import useContactUsAnalytics, { contactType } from "./useContactUsAnalytics";

jest.mock("mixpanel-browser");

describe("useContactUsAnalytics hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks if contactInitiated calls mixpanel correctly", () => {
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    const contactUsAnalytics = useContactUsAnalytics();
    contactUsAnalytics.contactInitiated(contactType.EMAIL);
    expect(mixpanelTrack).toBeCalledTimes(1);
    expect(mixpanelTrack).toBeCalledWith(
      expect.stringContaining("Contact Us Method"),
      expect.objectContaining({
        contactType: expect.stringContaining("Email")
      })
    );
  });
});
