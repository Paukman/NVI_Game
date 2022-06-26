import { atom, useAtom } from "jotai";
import { useAsyncEffect } from "use-async-effect";
import api, { preferencesUrl } from "api";

export const showOnboardingAtom = atom(false);
export const hasFetchedOnboardingAtom = atom(false);

const useToggleOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useAtom(showOnboardingAtom);
  const [hasFetchedOnboarding, setHasFetchedOnboarding] = useAtom(
    hasFetchedOnboardingAtom
  );

  const hideOnboarding = async () => {
    setShowOnboarding(false);
    try {
      await api.put(`${preferencesUrl}/preferences`, {
        webOnboardingSeen: true
      });
    } catch (e) {
      // Silently handle error.
    }
  };

  useAsyncEffect(async isMounted => {
    // Fetch preferences once only.
    if (!hasFetchedOnboarding) {
      try {
        const prefs = await api.get(`${preferencesUrl}/preferences`);

        if (!prefs.data?.webOnboardingSeen) {
          if (!isMounted()) return;
          setShowOnboarding(true);
        }
      } catch (e) {
        if (!isMounted()) return;
        setShowOnboarding(false);
      }
      setHasFetchedOnboarding(true);
    }
  }, []);

  return {
    showOnboarding,
    hideOnboarding
  };
};

export default useToggleOnboarding;
