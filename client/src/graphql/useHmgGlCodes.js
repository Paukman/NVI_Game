import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

import { mapArrayBy } from 'mdo-react-components';
import { buildErrors } from '../utils/apiHelpers';
import logger from '../utils/logger';

export const LIST_HMG_GL_CODES_QUERY = gql`
  query($params: HmgGlCodeFilter, $pagination: PaginationAndSortingInput) {
    hmgGlCodeList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

export const GET_HMG_GL_CODES_QUERY = gql`
  query($id: ID!) {
    hmgGlCodeGet(id: $id) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

export const LIST_HMG_GL_CODE_CREATE = gql`
  mutation($params: HmgGlCodeInput!) {
    hmgGlCodeCreate(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

export const LIST_HMG_GL_CODE_UPDATE = gql`
  mutation($id: ID!, $params: HmgGlCodeInput!) {
    hmgGlCodeUpdate(id: $id, params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

export const LIST_HMG_GL_CODE_REMOVE = gql`
  mutation($id: ID!) {
    hmgGlCodeRemove(id: $id) {
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

export const LIST_HMG_GL_CODE_MAP = gql`
  mutation($params: HmgGlCodeMapInput!) {
    hmgGlCodeMap(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelId
        hmgGlCode
        displayName
        mdoGlCode
        statusId
      }
    }
  }
`;

export const LIST_HMG_GL_CODE_SET_STATUS = gql`
  mutation($params: HmgGlCodeSetStatusInput) {
    hmgGlCodeSetStatus(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        statusId
      }
    }
  }
`;

export const LIST_HMG_GL_CODE_SET_STATUS_ALL = gql`
  mutation($params: HmgGlCodeSetStatusAllInput!) {
    hmgGlCodeSetStatusAll(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        mdoGlCode
        statusId
      }
    }
  }
`;

export const HMG_GL_CODE_LIST_MDO_STATUS = gql`
  query($params: HmgGlCodeListMdoStatusInput) {
    hmgGlCodeListMdoStatus(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        mdoGlCode
        statusId
      }
    }
  }
`;

export const HMG_GL_CODE_COPY_MAPPING = gql`
  mutation($params: HmgGlCodeCopyMappingInput!) {
    hmgGlCodeCopyMapping(params: $params) {
      code
      errors {
        name
        messages
      }
    }
  }
`;

export const HMG_GL_CODE_IMPORT = gql`
 mutation ($params: [HmgGlCodeInput!]) {
  hmgGlCodeCreateMany(params: $params) {
    code
    errors {
      name
      messages
    }
    data {
      hmgGlCode
    }
  }
}
`;

export const useHmgGlCodes = () => {
  const [hmgGlCodes, setHmgGlCodes] = useState([]);
  const [hmgGlCode, setHmgGlCode] = useState(null);
  const [lastOperationResult, setLastOperationResult] = useState({ ...buildErrors() });
  const [mdoGlCodeStatuses, setMdoGlCodeStatuses] = useState([]);
  const [hCStatus, setHCStatus] = useState('');

  const [queryListHmgGlCodes, { loading }] = useLazyQuery(LIST_HMG_GL_CODES_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const newItems = newData.hmgGlCodeList.data || [];
      setHmgGlCodes(newItems);

      setLastOperationResult({
        code: newData.hmgGlCodeList.code,
        errors: newData.hmgGlCodeList.errors,
      });
    },
  });

  const [queryGetHmgGlCode, { loading: loadingOne }] = useLazyQuery(GET_HMG_GL_CODES_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      const newItem = newData.hmgGlCodeGet.data || [];

      setHmgGlCode(newItem && newItem[0] ? newItem[0] : null);

      setLastOperationResult({
        code: newData.hmgGlCodeGet.code,
        errors: newData.hmgGlCodeGet.errors,
      });
    },
  });

  const [queryHmgGlCodeListMdoStatus, { loading: loadingMdoGlCodeStatuses }] = useLazyQuery(
    HMG_GL_CODE_LIST_MDO_STATUS,
    {
      client: apolloClient,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
      onCompleted: (response) => {
        const newItems = response.hmgGlCodeListMdoStatus.data || [];
        setMdoGlCodeStatuses(newItems);

        setLastOperationResult({
          code: response.hmgGlCodeListMdoStatus.code,
          errors: response.hmgGlCodeListMdoStatus.errors,
        });
      },
    },
  );

  const [mutationAddHmgGlCode, { loading: creating }] = useMutation(LIST_HMG_GL_CODE_CREATE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (newData) => {
      setLastOperationResult(newData.hmgGlCodeCreate);
    },
  });

  const [mutationUpdateHmgGlCode, { loading: updating }] = useMutation(LIST_HMG_GL_CODE_UPDATE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (newData) => {
      setLastOperationResult(newData.hmgGlCodeUpdate);
    },
  });

  const [mutationRemoveHmgGlCode, { loading: removing }] = useMutation(LIST_HMG_GL_CODE_REMOVE, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (newData) => {
      const result = newData.hmgGlCodeRemove;

      if (result.code === 0) {
        const data = result.data[0] || {};

        const updItems = hmgGlCodes.filter((item) => item.id !== data.id);

        setHmgGlCodes(updItems);
      }

      setLastOperationResult(result);
    },
  });

  const [mutationMapHmgGlCode, { loading: mapping }] = useMutation(LIST_HMG_GL_CODE_MAP, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (newData) => {
      const result = newData.hmgGlCodeMap;

      if (result.code === 0) {
        const data = result.data[0] || {};

        const updItems = hmgGlCodes.map((item) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });

        setHmgGlCodes(updItems);
      }

      setLastOperationResult(result);
    },
  });

  const [mutationsetHmgGlCodeStatus, { loading: settingStatus }] = useMutation(LIST_HMG_GL_CODE_SET_STATUS, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (newData) => {
      if (newData.hmgGlCodeSetStatus.code === 0) {
        // const data = newData.hmgGlCodeSetStatus.data[0] || {};
        // const updItems = hmgGlCodes.map((item) => {
        //   if (item.mdoGlCode === data.mdoGlCode) {
        //     item.statusId = data.statusId;
        //   }
        //   return item;
        // });

        // let updated = false;
        // const updStatuses = mdoGlCodeStatuses.map((item) => {
        //   if (item.mdoGlCode === data.mdoGlCode) {
        //     item.statusId = data.statusId;
        //     updated = true;
        //   }
        //   return item;
        // });

        // if (!updated) {
        //   updStatuses.push(data);
        // }

        // setHmgGlCodes([...updItems]);
        // setMdoGlCodeStatuses([...updStatuses]);
        setHCStatus('done');
      }

      setLastOperationResult(newData.hmgGlCodeSetStatus);
    },
  });

  const [mutationsetHmgGlCodeStatusAll, { loading: settingStatusAll }] = useMutation(LIST_HMG_GL_CODE_SET_STATUS_ALL, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      if (response.hmgGlCodeSetStatusAll.code === 0) {
        const data = response.hmgGlCodeSetStatusAll.data || [];
        const mappedData = mapArrayBy(data, 'mdoGlCode');
        const updItems = hmgGlCodes.map((item) => {
          if (mappedData[item.mdoGlCode]) {
            item.statusId = mappedData[item.mdoGlCode].statusId;
          }
          return item;
        });

        const mapMdoGlCodeStatuses = mapArrayBy(mdoGlCodeStatuses, 'mdoGlCode');
        const updStatuses = [];

        data.forEach((item) => {
          if (mapMdoGlCodeStatuses[item.mdoGlCode]) {
            mapMdoGlCodeStatuses[item.mdoGlCode].statusId = item.statusId;
          }

          updStatuses.push(item);
        });

        setHmgGlCodes(updItems);
        setMdoGlCodeStatuses(updStatuses);
      }

      setLastOperationResult(response.hmgGlCodeSetStatusAll);
    },
  });

  const [mutationHmgGlCodeCopyMapping, { loading: hmgGlCodeCopyingMapping }] = useMutation(HMG_GL_CODE_COPY_MAPPING, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: (response) => {
      const result = response?.hmgGlCodeCopyMapping;

      setLastOperationResult({
        ...buildErrors(result),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when copying HMG GL Code mapping:', response);

      setLastOperationResult({
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when copying HMG GL Code mapping. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const listHmgGlCodes = useCallback(
    (params) => {
      setLastOperationResult({});
      queryListHmgGlCodes({ variables: params });
    },
    [queryListHmgGlCodes, setLastOperationResult],
  );

  const getHmgGlCode = useCallback(
    (id) => {
      setLastOperationResult({});
      queryGetHmgGlCode({ variables: { id } });
    },
    [queryGetHmgGlCode, setLastOperationResult],
  );

  const hmgGlCodeListMdoStatus = useCallback(
    (params) => {
      setLastOperationResult({});
      queryHmgGlCodeListMdoStatus({ variables: params });
    },
    [queryHmgGlCodeListMdoStatus, setLastOperationResult],
  );

  const createHmgGlCode = useCallback(
    (variables) => {
      setLastOperationResult({});
      mutationAddHmgGlCode({ variables });
    },
    [mutationAddHmgGlCode, setLastOperationResult],
  );

  const updateHmgGlCode = useCallback(
    (variables) => {
      setLastOperationResult({});
      mutationUpdateHmgGlCode({ variables });
    },
    [mutationUpdateHmgGlCode, setLastOperationResult],
  );

  const removeHmgGlCode = useCallback(
    (id) => {
      setLastOperationResult({});
      mutationRemoveHmgGlCode({ variables: { id } });
    },
    [mutationRemoveHmgGlCode, setLastOperationResult],
  );

  const mapHmgGlCode = useCallback(
    (params) => {
      setLastOperationResult({});
      mutationMapHmgGlCode({ variables: params });
    },
    [mutationMapHmgGlCode, setLastOperationResult],
  );

  const setHmgGlCodeStatus = useCallback(
    (params) => {
      setHCStatus('');
      setLastOperationResult({});
      mutationsetHmgGlCodeStatus({ variables: params });
    },
    [mutationsetHmgGlCodeStatus, setLastOperationResult],
  );

  const setHmgGlCodeStatusAll = useCallback(
    (params) => {
      setLastOperationResult({});
      mutationsetHmgGlCodeStatusAll({ variables: params });
    },
    [mutationsetHmgGlCodeStatusAll, setLastOperationResult],
  );

  const hmgGlCodeCopyMapping = useCallback(
    (params) => {
      setLastOperationResult({ ...buildErrors() });
      mutationHmgGlCodeCopyMapping({ variables: { params } });
    },
    [mutationHmgGlCodeCopyMapping, setLastOperationResult],
  );

  return {
    listHmgGlCodes,
    getHmgGlCode,
    hmgGlCodeListMdoStatus,
    createHmgGlCode,
    updateHmgGlCode,
    removeHmgGlCode,
    mapHmgGlCode,
    setHmgGlCodeStatus,
    setHmgGlCodeStatusAll,
    hmgGlCodeCopyMapping,
    loading,
    loadingOne,
    loadingMdoGlCodeStatuses,
    creating,
    updating,
    removing,
    mapping,
    settingStatus,
    settingStatusAll,
    hmgGlCode,
    hmgGlCodes,
    mdoGlCodeStatuses,
    lastOperationResult,
    hmgGlCodeCopyingMapping,
    hCStatus,
  };
};
