import mixpanel from "mixpanel-browser";

const eventType = {
  PRIVACY_SECURITY: "Privacy & Security"
};

export const disclaimerType = {
  PRIVACY: "Privacy",
  SECURITY: "Security"
};

const usePrivacyAndSecurityAnalytics = () => {
  const disclaimerOpened = type => {
    mixpanel.track(eventType.PRIVACY_SECURITY, {
      isPrivacyOrSecurity: type
    });
  };

  return { disclaimerOpened };
};

export default usePrivacyAndSecurityAnalytics;
