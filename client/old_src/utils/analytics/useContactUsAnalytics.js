import mixpanel from "mixpanel-browser";

const eventType = {
  CONTACT_US: "Contact Us Method"
};

export const contactType = {
  FEEDBACK: "Feedback",
  CALL: "Call",
  EMAIL: "Email"
};

const useContactUsAnalytics = () => {
  const contactInitiated = type => {
    mixpanel.track(eventType.CONTACT_US, {
      contactType: type
    });
  };

  return { contactInitiated };
};

export default useContactUsAnalytics;
