import React from 'react';

const initUserState = {
  email: '',
  email_verified: true,
  name: '',
  nickname: '',
  picture: '',
  sub: '',
  updated_at: null,
  token: '',
};

const UserContext = React.createContext(null);

export { UserContext, initUserState };
