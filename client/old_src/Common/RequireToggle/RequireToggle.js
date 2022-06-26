import useFeatureToggle from "utils/hooks/useFeatureToggle";

const RequireToggle = ({ toggle, children }) => {
  const [devToggle] = useFeatureToggle(toggle);
  return devToggle ? children : null;
};

export default RequireToggle;
