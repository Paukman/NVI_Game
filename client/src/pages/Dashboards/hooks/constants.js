import { getText } from 'utils';

export const pageState = {
  ERROR: { state: 'ERROR' },
  MESSAGE: { state: 'MESSAGE', message: getText('dashboard.noComments') },
  LOADING: { state: 'LOADING' },
  NONE: { state: 'NONE' },
};
