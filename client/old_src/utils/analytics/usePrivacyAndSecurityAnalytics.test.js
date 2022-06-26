import mixpanel from "mixpanel-browser";
import usePrivacyAndSecurityAnalytics, {
  disclaimerType
} from "./usePrivacyAndSecurityAnalytics";

jest.mock("mixpanel-browser");

describe("usePrivacyAndSecurityAnalytics hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks if disclaimerOpened calls mixpanel correctly", () => {
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    const contactUsAnalytics = usePrivacyAndSecurityAnalytics();
    contactUsAnalytics.disclaimerOpened(disclaimerType.PRIVACY);
    expect(mixpanelTrack).toBeCalledTimes(1);
    expect(mixpanelTrack).toBeCalledWith(
      expect.stringContaining("Privacy & Security"),
      expect.objectContaining({
        isPrivacyOrSecurity: expect.stringContaining("Privacy")
      })
    );
  });
});
