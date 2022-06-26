import { useEffect, useRef, useState } from "react";
import useIdle from "utils/hooks/useIdle";
import useIsMounted from "utils/hooks/useIsMounted";
import { useAuth0 } from "utils/auth0/Auth0Wrapper";
import timer from "./timer";

const WARNING_TIME = 2;

const initialCountdown = {
  minutes: WARNING_TIME,
  seconds: 120
};
const useAutoLogout = idleTime => {
  const { logout } = useAuth0();
  const [isIdle] = useIdle(idleTime);
  const [time, setTime] = useState(initialCountdown);
  const [show, setShow] = useState(false);
  const isMounted = useIsMounted();
  const intervalId = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalId.current);
      intervalId.current = null;
    };
  }, []);

  const handleLogout = () => {
    clearInterval(intervalId.current);
    intervalId.current = null;
    setShow(false);
    logout({
      returnTo: `${window.location.origin}/logout?loggedOutMessage=inactive`
    });
  };

  const handleContinue = () => {
    clearInterval(intervalId.current);
    intervalId.current = null;
    setShow(false);
    setTime(initialCountdown);
  };

  useEffect(() => {
    const runCountdown = () => {
      const listener = ({ min, sec, secondsCounter }) => {
        if (secondsCounter === 0) {
          handleLogout();
        }
        setTime({
          minutes: min,
          sec,
          seconds: secondsCounter
        });
      };

      intervalId.current = timer(
        [WARNING_TIME, initialCountdown.seconds],
        listener
      );
    };
    if (isIdle && !intervalId.current && isMounted()) {
      runCountdown();
      setShow(true);
    }
  }, [isIdle, isMounted]);

  return { time, show, handleLogout, handleContinue, isIdle, intervalId };
};

export default useAutoLogout;
