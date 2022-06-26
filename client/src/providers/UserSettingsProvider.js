import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext, UserSettingsContext } from '../contexts';
import { useUserSettings } from '../graphql';
import { logger } from 'utils';

const UserSettingsProvider = (props) => {
  const { children } = props;
  const { user } = useContext(UserContext);
  const hooks = useUserSettings();
  const { userSettings, setUserSettings } = useState(null);
  const { userSettingsState, userSettingsGetList } = hooks;

  useEffect(() => {
    if (user?.userId) {
      logger.debug(`Loading user (${user.userId}) settings ...`);
      userSettingsGetList({});
    }
  }, [user]);

  return <UserSettingsContext.Provider value={hooks}>{children}</UserSettingsContext.Provider>;
};

UserSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { UserSettingsProvider };
