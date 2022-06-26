import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useRedirect = (to, condition) => {
  const history = useHistory();

  useEffect(() => {
    if (condition) {
      history.push(to);
    }
  }, [history, to, condition]);

  return { to, condition, history };
};

export default useRedirect;
