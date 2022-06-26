import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { HmgGlCodesMapping, HmgGlCodesHierarchy } from './index';

import { APP_KEYS } from 'config/appSettings';

const HmgGlCodes = () => {
  const location = useLocation();
  if (location?.pathname?.includes(APP_KEYS.GL_MAPPING)) {
    return <HmgGlCodesMapping />;
  } else if (location?.pathname?.includes(APP_KEYS.GL_HIERARCHY)) {
    return <HmgGlCodesHierarchy />;
  }
};

HmgGlCodes.displayName = 'HmgGlCodes';

export { HmgGlCodes };
