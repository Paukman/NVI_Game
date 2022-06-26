import { useCallback, useState } from 'react';
import { uniqBy } from 'lodash';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

import { parseJsonSafe } from '../utils/dataManipulation';

import { mapArrayBy } from 'mdo-react-components';

// TODO: Remove next line when BE is ready
import { siteMap as localItems } from '../config/siteMap';

/**
 * TODO: Use real query as soon as it is ready
 */
export const DICTIONARY_LIST = gql`
  query($params: DictionaryFilter, $pagination: PaginationAndSortingInput) {
    dictionaryList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        statusId
        dictionaryTypeId
        value
        displayName
        orderNo
        dictionaryType {
          typeName
          valueType
        }
      }
    }
  }
`;

export const useDictionary = () => {
  const [dictionary, setDictionary] = useState({ data: [], types: {}, typesNames: [], errors: [] });

  const [queryDictionary, { loading: dictionaryLoading }] = useLazyQuery(DICTIONARY_LIST, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setDictionary({
        data: [],
        types: {},
        typesNames: [],
        errors: [{ name: '', messages: [`Something went wrong when querying dictionary. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.dictionaryList || {};

        const data = (result.data || []).map((item) => {
          const { value, displayName, orderNo, dictionaryType } = item;

          return {
            value,
            displayName,
            orderNo,
            typeName: (dictionaryType?.typeName || '').toLowerCase(),
            valueType: (dictionaryType?.valueType || '').toLowerCase(),
          };
        });

        const types = mapArrayBy(data, 'typeName', { multiple: true });

        setDictionary({
          data: result.data || [],
          types,
          typesNames: Object.keys(types),
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setDictionary({
          data: [],
          types: {},
          typesNames: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for dictionary. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const listDictionary = useCallback(
    (params) => {
      queryDictionary({ variables: params });
    },
    [queryDictionary],
  );

  return {
    listDictionary,
    dictionaryLoading,
    dictionaryItems: dictionary.data,
    dictionaryTypes: dictionary.types,
    dictionaryTypesNames: dictionary.typesNames,
    errors: dictionary.errors,
  };
};
