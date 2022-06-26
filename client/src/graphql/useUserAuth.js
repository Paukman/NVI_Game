import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

/**
 * TODO: Use real query as soon as it is ready
 */
export const USER_SIGN_IN = gql`
  mutation($params: UserSignIn) {
    userSignIn(params: $params) {
      code
      errors {
        name
        messages
      }
      data
    }
  }
`;

export const useUserAuth = () => {
  const [userMdoToken, setUserMdoToken] = useState({ data: '', errors: [] });

  const [mutationSignIn, { loading: signingIn }] = useMutation(USER_SIGN_IN, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onError: (response) => {
      setUserMdoToken({
        data: [],
        keys: {},
        errors: [{ name: '', messages: [`Something went wrong when signing in. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.userSignIn || {};
        const mdoToken = Array.isArray(result.data) ? result.data[0] || '' : '';

        setUserMdoToken({
          data: mdoToken,
          errors: result.errors,
        });
      } catch (ex) {
        setUserMdoToken({
          data: '',
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when signing in. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const signIn = useCallback(
    (params) => {
      mutationSignIn({ variables: params });
    },
    [mutationSignIn],
  );

  return {
    signIn,
    signingIn,
    mdoToken: userMdoToken.data,
    errors: userMdoToken.errors,
  };
};
