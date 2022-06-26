import { useCallback, useState } from 'react';
import { initUserState } from '../contexts';
import logger from '../utils/logger';

const useUser = () => {
  const [user, setUser] = useState(initUserState);

  const setUserInfo = useCallback(
    (userInfo) => {
      setUser({
        ...user,
        ...userInfo,
      });

      logger.debug('User information has changed:', userInfo);

      if (userInfo.mdoToken != undefined) {
        localStorage.setItem('__t', userInfo.mdoToken);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser],
  );

  const clearUserInfo = useCallback(() => {
    logger.debug('Clear user information');
    setUser(initUserState);
    localStorage.removeItem('__t');
  }, [setUser]);

  const updateMdoToken = useCallback(
    (mdoToken) => {
      logger.debug('Set user MDO token');
      setUser({
        ...user,
        mdoToken,
      });
      localStorage.setItem('__t', mdoToken);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setUser],
  );

  return {
    user,
    setUserInfo,
    clearUserInfo,
    updateMdoToken,
  };
};

export { useUser };
