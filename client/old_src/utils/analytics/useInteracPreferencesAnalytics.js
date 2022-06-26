import mixpanel from "mixpanel-browser";

const eventType = {
  PROFILE_CREATED: "Interac Profile Created",
  PROFILE_UPDATED: "Interac Profile Updated",
  REGISTRATION_STARTED: "Interac Autodeposit Registration Started",
  REGISTRATION_COMPLETED: "Interac Autodeposit Registered",
  REGISTRATION_UPDATED: "Interac Autodeposit Updated",
  REGISTRATION_CANCELLED: "Interac Autodeposit Cancelled"
};

const useInteracPreferencesAnalytics = () => {
  const autodepositRegistrationStarted = () => {
    mixpanel.track(eventType.REGISTRATION_STARTED);
  };

  const autodepositRegistrationCompleted = () => {
    mixpanel.track(eventType.REGISTRATION_COMPLETED);
  };

  const autodepositRegistrationUpdated = () => {
    mixpanel.track(eventType.REGISTRATION_UPDATED);
  };

  const autodepositRegistrationCancelled = () => {
    mixpanel.track(eventType.REGISTRATION_CANCELLED);
  };

  const profileCreated = () => {
    mixpanel.track(eventType.PROFILE_CREATED);
  };

  const profileUpdated = () => {
    mixpanel.track(eventType.PROFILE_UPDATED);
  };

  return {
    autodepositRegistrationStarted,
    autodepositRegistrationCompleted,
    autodepositRegistrationCancelled,
    autodepositRegistrationUpdated,
    profileCreated,
    profileUpdated
  };
};

export default useInteracPreferencesAnalytics;
