import { useCallback, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

export const QUERY_HOTEL_AR_AGING_DASHBOARD_GET = gql`
  query($params: HotelArAgingDashboardInput) {
    hotelArAgingGetDashboard(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        hotel {
          id
          hotelName
        }
        due030
        due3160
        due6190
        due91120
        dueOver120
        total
        highlights {
          highlight
          fields
        }
        max
      }
    }
  }
`;

export const QUERY_HOTEL_AR_AGING_PROPERTY_GET = gql`
  query($params: HotelArAgingPropertyInput) {
    hotelArAgingGetProperty(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        sourceAccountName
        hotelClientAccountId
        hotelClientAccount {
          accountName
        }
        due030
        due3160
        due6190
        due91120
        dueOver120
        total
        highlights {
          highlight
          fields
        }
        max
        latestComment {
          id
          hotelId
          hotelClientAccountId
          message
          createdBy
          updatedBy
          userCreated {
            displayName
          }
          userUpdated {
            displayName
          }
          createdAt
        }
      }
    }
  }
`;

export const QUERY_HOTEL_AR_AGING_ACCOUNT_GET = gql`
  query($params: HotelArAgingAccountInput) {
    hotelArAgingGetAccount(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        hotel {
          id
          hotelName
        }
        sourceAccountName
        due030
        due3160
        due6190
        due91120
        dueOver120
        total
        highlights {
          highlight
          fields
        }
        max
        latestComment {
          id
          hotelId
          hotelClientAccountId
          message
          createdBy
          updatedBy
          userCreated {
            displayName
          }
          userUpdated {
            displayName
          }
          createdAt
        }
      }
    }
  }
`;

export const QUERY_HOTEL_AR_AGING_COMMENTS_LIST = gql`
  query($params: HotelArAgingCommentListFilter) {
    hotelArAgingListComments(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hotelClientAccountId
        message
        createdBy
        userCreated {
          displayName
        }
        createdAt
      }
    }
  }
`;

export const MUTATION_HOTEL_AR_AGING_COMMENTS_POST = gql`
  mutation($params: HotelArAgingCommentInput) {
    hotelArAgingPostComment(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hotelClientAccountId
        message
        createdBy
        userCreated {
          displayName
        }
        createdAt
      }
    }
  }
`;

export const useARReport = () => {
  const [hotelARDashboardGet, setHotelARDashboardGet] = useState({ data: [], code: null, errors: [] });
  const [hotelARPropertyGet, setHotelARPropertyGet] = useState({ data: [], code: null, errors: [] });
  const [hotelARAgingCommentsList, setHotelARAgingCommentsList] = useState({ data: [], code: null, errors: [] });
  const [hotelARAgingCommentsPost, setHotelARAgingCommentsPost] = useState({ data: [], code: null, errors: [] });
  const [hotelARAccountGet, setHotelARAccountGet] = useState({ data: [], code: null, errors: [] });

  const [queryHotelARDashboardGet, { loading: ARDashboardLoading }] = useLazyQuery(QUERY_HOTEL_AR_AGING_DASHBOARD_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setHotelARDashboardGet({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying AR Dashboard. Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelArAgingGetDashboard || {};
        setHotelARDashboardGet({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: result.code ? result.code : null,
        });
      } catch (ex) {
        setHotelARDashboardGet({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for AR Mapping Report. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryHotelARPropertyGet, { loading: ARPropertyLoading }] = useLazyQuery(QUERY_HOTEL_AR_AGING_PROPERTY_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setHotelARPropertyGet({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying AR Property. Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelArAgingGetProperty || {};

        setHotelARPropertyGet({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: result.code ? result.code : null,
        });
      } catch (ex) {
        setHotelARPropertyGet({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for AR Mapping Report. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryHotelARAccountGet, { loading: ARAccountLoading }] = useLazyQuery(QUERY_HOTEL_AR_AGING_ACCOUNT_GET, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setHotelARAccountGet({
        data: [],
        errors: [
          {
            name: '',
            messages: [`Something went wrong when querying AR Account. Please try later`],
          },
        ],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.hotelArAgingGetAccount || {};

        setHotelARAccountGet({
          data: Array.isArray(result.data) ? result.data : [],
          errors: Array.isArray(result.errors) ? result.errors : [],
          code: result.code ? result.code : null,
        });
      } catch (ex) {
        setHotelARAccountGet({
          data: [],

          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for AR Mapping Report. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const [queryHotelARAgingCommentsList, { loading: ARAgingCommentsListLoading }] = useLazyQuery(
    QUERY_HOTEL_AR_AGING_COMMENTS_LIST,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onError: (response) => {
        setHotelARAgingCommentsList({
          data: [],
          code: null,
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying AR Aging Comments. Please try later`],
            },
          ],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.hotelArAgingListComments || {};

          setHotelARAgingCommentsList({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
            code: result.code ? result.code : null,
          });
        } catch (ex) {
          setHotelARAgingCommentsList({
            data: [],
            code: null,
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for AR Aging Comments. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const [mutationHotelARAgingCommentsPost, { loading: ARAgingCommentsPostLoading }] = useMutation(
    MUTATION_HOTEL_AR_AGING_COMMENTS_POST,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'no-cache',
      onError: (response) => {
        setHotelARAgingCommentsPost({
          data: [],
          errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
        });
      },
      onCompleted: (response) => {
        try {
          const result = response.hotelArAgingPostComment || {};

          setHotelARAgingCommentsPost({
            data: Array.isArray(result.data) ? result.data : [],
            errors: Array.isArray(result.errors) ? result.errors : [],
            code: Array.isArray(result.code) ? result.code : null,
          });
        } catch (ex) {
          setHotelARAgingCommentsList({
            data: [],
            errors: [
              {
                name: '',
                messages: [
                  `Something went wrong as there is no response from the server for account. Please try later`,
                ],
              },
            ],
          });
        }
      },
    },
  );

  const listARDashboard = useCallback(
    (params) => { 
      queryHotelARDashboardGet({ variables: params });
    },
    [queryHotelARDashboardGet],
  );

  const listARProperty = useCallback(
    (params) => {
      queryHotelARPropertyGet({ variables: params });
    },
    [queryHotelARPropertyGet],
  );

  const listARAccount = useCallback(
    (params) => {
      queryHotelARAccountGet({ variables: params });
    },
    [queryHotelARAccountGet],
  );

  const listARAgingComments = useCallback(
    (params) => {
      queryHotelARAgingCommentsList({ variables: params });
    },
    [queryHotelARAgingCommentsList],
  );

  const postARAgingComments = useCallback(
    (params) => {
      mutationHotelARAgingCommentsPost({ variables: params });
    },
    [mutationHotelARAgingCommentsPost],
  );

  return {
    hotelARDashboardGet,
    hotelARPropertyGet,
    hotelARAccountGet,
    hotelARAgingCommentsList,
    hotelARAgingCommentsPost,
    postARAgingComments,
    ARDashboardLoading,
    ARPropertyLoading,
    ARAccountLoading,
    ARAgingCommentsListLoading,
    ARAgingCommentsPostLoading,
    listARDashboard,
    listARProperty,
    listARAgingComments,
    listARAccount,
    setHotelARAgingCommentsList,
    setHotelARAgingCommentsPost,
  };
};
