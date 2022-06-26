import mixpanel from "mixpanel-browser";
import api, { userProfilesBaseUrl } from "api";

const init = () => {
  if (window.envConfig.MIXPANEL_TOKEN) {
    mixpanel.init(window.envConfig.MIXPANEL_TOKEN, { secure_cookie: true });

    // Register Super Properties
    mixpanel.register({
      platformUsed: "Rebank Web",
      platformVersion: window.envConfig.VERSION_HASH
    });
  }
};

const setUser = () => {
  api.get(`${userProfilesBaseUrl}/mixpanel`).then(result => {
    mixpanel.identify(result.data.id);
  });
};

const loginSuccess = () => {
  mixpanel.track("Login - Success");
};

const logout = () => {
  mixpanel.reset();
};

export { init, setUser, loginSuccess, logout };
