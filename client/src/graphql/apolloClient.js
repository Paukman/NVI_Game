import { onError } from '@apollo/client/link/error';
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { appSettings } from '../config/appSettings';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('__t');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`),
        );
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    authLink.concat(
      new HttpLink({
        uri: appSettings.graphql,
        credentials: 'include',
      }),
    ),
  ]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  returnPartialData: true,
});

export default apolloClient;
