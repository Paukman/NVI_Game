import { useAtom } from "jotai";
import mixpanel from "mixpanel-browser";
import { secondaryNavLocationAtom } from "./usePathTracking";

const eventType = {
  ADD_CONTACT: "Contact Added",
  REMOVE_CONTACT: "Contact Removed"
};

export const contactType = {
  RECIPIENT: "Recipient",
  PAYEE: "Payee"
};

const useContactAnalytics = () => {
  const [navLocation] = useAtom(secondaryNavLocationAtom);

  const contactAdded = type => {
    mixpanel.track(eventType.ADD_CONTACT, {
      contactType: type,
      addLocation: navLocation
    });
  };

  const contactRemoved = type => {
    mixpanel.track(eventType.REMOVE_CONTACT, {
      contactType: type,
      addLocation: navLocation
    });
  };

  return { contactAdded, contactRemoved };
};

export default useContactAnalytics;
