import mixpanel from "mixpanel-browser";
import useInteracPreferencesAnalytics from "./useInteracPreferencesAnalytics";

jest.mock("mixpanel-browser");

describe("useInteracPreferencesAnalytics hook tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("checks if autodepositRegistrationStarted calls mixpanel correctly", () => {
    const mixpanelTrack = jest.spyOn(mixpanel, "track").mockImplementation();
    const interacPreferencesAnalytics = useInteracPreferencesAnalytics();
    interacPreferencesAnalytics.autodepositRegistrationStarted();
    interacPreferencesAnalytics.autodepositRegistrationCompleted();
    interacPreferencesAnalytics.autodepositRegistrationCancelled();
    interacPreferencesAnalytics.autodepositRegistrationUpdated();
    interacPreferencesAnalytics.profileCreated();
    interacPreferencesAnalytics.profileUpdated();
    expect(mixpanelTrack).toBeCalledTimes(6);
  });
});
