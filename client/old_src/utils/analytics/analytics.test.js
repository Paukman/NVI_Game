import mixpanel from "mixpanel-browser";
import { userProfilesBaseUrl } from "api";
import { mockApiData } from "utils/TestUtils";
import * as analytics from "./analytics";

beforeEach(() => {
  mixpanel.track.mockClear();
});

describe("Mixpanel analytics", () => {
  it(">> should call initialize mixpanel with api token", async () => {
    const TOKEN = "some-token";
    window.envConfig.MIXPANEL_TOKEN = TOKEN;

    analytics.init();

    expect(mixpanel.init).toHaveBeenCalledWith(TOKEN, { secure_cookie: true });
  });

  it(">> should call register super properties on initialize", async () => {
    const MIXPANEL_TOKEN = "some-token";
    const VERSION_HASH = "0.0.0";
    window.envConfig = {
      MIXPANEL_TOKEN,
      VERSION_HASH
    };

    analytics.init();

    expect(mixpanel.register).toHaveBeenCalledWith({
      platformUsed: "Rebank Web",
      platformVersion: VERSION_HASH
    });
  });

  it(">> should call mixpanel identify with mixpanel guid", async () => {
    const expectedGUID = "some-guid";
    mockApiData([
      {
        url: `${userProfilesBaseUrl}/mixpanel`,
        results: {
          id: expectedGUID
        }
      }
    ]);
    await analytics.setUser();

    expect(mixpanel.identify).toHaveBeenCalledWith(expectedGUID);
  });

  it(">> should call mixpanel track on loginSuccess", async () => {
    analytics.loginSuccess();
    expect(mixpanel.track).toHaveBeenCalled();
  });

  it(">> should call mixpanel reset on logout", async () => {
    analytics.logout();
    expect(mixpanel.reset).toHaveBeenCalled();
  });
});
