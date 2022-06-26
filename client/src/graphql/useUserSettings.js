import gql from 'graphql-tag';
import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';
import logger from '../utils/logger';

export const USER_SETTINGS_LIST_QUERY = gql`
  query ($params: UserSettingsInput, $pagination: PaginationAndSortingInput) {
    userSettingsList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        settingTypeId
        settingCode
        settingName
        userSettingValue
        valueTypeId
      }
    }
  }
`;

export const USER_SETTINGS_GET_QUERY = gql`
  query ($id: String) {
    userSettingsGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        settingTypeId
        settingCode
        settingName
        defaultValue
        valueTypeId
      }
    }
  }
`;

export const USER_SETTINGS_GET_MANY_QUERY = gql`
  query ($id: [String]) {
    userSettingsGetMany(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        settingTypeId
        settingCode
        settingName
        valueTypeId
      }
    }
  }
`;

export const USER_SETTINGS_SET_MUTATION = gql`
  mutation ($params: [UserSettingsSetInput]) {
    userSettingsSet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
      }
    }
  }
`;

export const useUserSettings = () => {
  const [userSettingsList, setSettingsList] = useState({ data: [], errors: [] });
  const [userSettingsGet, setSettingsGet] = useState({ data: [], errors: [] });
  const [userSettingsGetMany, setSettingsGetMany] = useState({ data: [], errors: [] });
  const [userSettingSetState, setUserSettingSetState] = useState({ data: null, errors: [] });
  const [userSettingsState, setUserSettingsState] = useState({ data: null, errors: [] });

  const [queryUserSettingsList, { loading: userSettingsListQueryLoading }] = useLazyQuery(USER_SETTINGS_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      try {
        const result = response.userSettingsList || {};
        const data = Array.isArray(result.data) ? result.data : [];

        const mapSettingCode = {};
        const mapSettingTypeId = data.reduce((acc, item) => {
          if (!item) {
            return acc;
          }

          const key = `${item.settingTypeId}`;

          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push(item);

          mapSettingCode[item.settingCode] = item.userSettingValue;

          return acc;
        }, {});

        setUserSettingsState({
          data,
          mapSettingCode,
          mapSettingTypeId,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        logger.error('Something went wrong when fetching User Settings List: ', ex);

        setUserSettingsState({
          data: [],
          errors: [{ name: '', message: [`Something went wrong when fetching User Settings List. Please try later.`] }],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when fetching User Settings List:', response);

      setUserSettingsState({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when fetching User Settings List. Please try later.`],
          },
        ],
      });
    },
  });

  const [querySettingListGet, { loading: userSettingsListLoading }] = useLazyQuery(USER_SETTINGS_LIST_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setSettingsList({
        data: [],
        code: 0,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying User Settings . Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.userSettingsList || {};
        setSettingsList({
          data: result.data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setSettingsList({
          data: [],
          code: 0,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for Settings List. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [querySettingsGet, { loading: settingsGetLoading }] = useLazyQuery(USER_SETTINGS_GET_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setSettingsGet({
        data: [],
        items: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying User Settings . Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.userSettingsGet || {};

        setSettingsGet({
          data: result.data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setSettingsGet({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for Settings List. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [querySettingGetMany, { loading: settingGetManyLoading }] = useLazyQuery(USER_SETTINGS_GET_MANY_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setSettingsGetMany({
        data: [],
        items: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying User Multiple Settings . Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.userSettingsGetMany || {};

        setSettingsGetMany({
          data: result.data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setSettingsGetMany({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for Settings Many List. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [mutationUserSettingsSet, { loading: userSettingsSetLoading }] = useMutation(USER_SETTINGS_SET_MUTATION, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      try {
        const result = response.userSettingsSet || {};
        const data = Array.isArray(result.data) ? result.data : [];

        setUserSettingSetState({
          data: data,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setUserSettingSetState({
          data: null,
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server when setting user settings . Please try later`,
              ],
            },
          ],
        });
      }
    },
    onError: (response) => {
      logger.error('Something went wrong when setting user settings :', response);

      setUserSettingSetState({
        data: null,
        errors: [
          {
            name: '',
            messages: [`Something went wrong when setting user settings . Please try later`],
          },
        ],
      });
    },
  });

  const settingsListGet = useCallback(
    (params) => {
      setSettingsList({ data: null, errors: [] });
      querySettingListGet({ variables: params });
    },
    [querySettingListGet],
  );

  const settingsGet = useCallback(
    (params) => {
      querySettingsGet({ variables: params });
    },
    [querySettingsGet],
  );

  const settingGetMany = useCallback(
    (params) => {
      querySettingGetMany({ variables: params });
    },
    [querySettingGetMany],
  );

  const userSettingsSet = useCallback(
    (params) => {
      setUserSettingSetState({ data: null, errors: [] });
      mutationUserSettingsSet({ variables: params });
    },
    [mutationUserSettingsSet],
  );

  const userSettingsGetList = useCallback(
    (params) => {
      setUserSettingSetState({ data: null, errors: [] });
      queryUserSettingsList({ variables: { params } });
    },
    [queryUserSettingsList],
  );

  return {
    settingsListGet,
    userSettingsList,
    userSettingsListLoading,
    userSettingsGet,
    // settingsGetLoading,
    settingsGet,
    settingGetMany,
    // settingGetManyLoading,
    userSettingsGetMany,

    userSettingsSet,
    userSettingSetState,
    userSettingsSetLoading,

    userSettingsState,
    userSettingsGetList,
    userSettingsListQueryLoading,
  };
};
