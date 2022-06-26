import { useState, useEffect } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
import { featureToggleBaseUrl, manualApiFetch } from "api";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";

const useFeatureToggle = (toggle, key) => {
  if (!key) key = toggle;

  const [render, setRender] = useState(false);
  const { isAuthenticated } = useAuth0();

  const isMounted = useIsMounted();

  useEffect(() => {
    const featureToggle = async () => {
      try {
        const response = await manualApiFetch(
          `${featureToggleBaseUrl}/${toggle}`,
          key
        );
        if (isMounted() && response && response.value) {
          setRender(response.value.status);
        }
      } catch (e) {
        if (isMounted()) {
          setRender(false);
        }
      }
    };
    if (isAuthenticated) featureToggle();
  }, [toggle, key, isMounted, isAuthenticated]);

  return [render];
};

export default useFeatureToggle;
