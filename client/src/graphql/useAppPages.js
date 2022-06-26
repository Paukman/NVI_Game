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
export const LIST_APP_PAGES = gql`
  query ($params: AppPageFilter, $pagination: PaginationAndSortingInput) {
    appPageList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        pageStatusId
        pageKey
        pagePath
        pageTitle
        pageSubtitle
        pageDescription
        pageComponent
        pageLayout
        pageSettings
        redirectUrl
        redirectMode
        pageToggles {
          toggleName
          toggleIcon
          toggleTooltip
          referToPageKey
          orderNo
          toggleStatusId
        }
        metaInformation {
          settingCode
          settingValue
        }
      }
    }
  }
`;

export const useAppPages = () => {
  const [appPages, setAppPages] = useState({ data: [], keys: {}, errors: [] });
  const [pageProps, setPagePropsLocal] = useState({});

  const [queryAppPages, { loading }] = useLazyQuery(LIST_APP_PAGES, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setAppPages({
        data: [],
        keys: {},
        errors: [{ name: '', messages: [`Something went wrong when querying application pages. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.appPageList || {};
        const tmpPages = Array.isArray(result.data) ? result.data : [];
        const newPages = tmpPages.map((page) => {
          return {
            orderNo: page.orderNo,
            pageKey: page.pageKey,
            name: page.pageTitle,
            subtitle: page.pageSubtitle,
            url: page.pagePath,
            component: page.pageComponent,
            layout: page.pageLayout || 'EmptyLayout',
            options: {
              ...parseJsonSafe(page.pageSettings, {}),
              url: page.redirectUrl,
              redirectMode: page.redirectMode,
              metaInformation: Array.isArray(page.metaInformation)
                ? page.metaInformation.reduce((acc, item) => {
                    acc[item.settingCode] = item.settingValue;
                    return acc;
                  }, {})
                : {},
            },
            items: [],
          };
        });

        const data = uniqBy([...newPages, ...localItems], 'url');

        setAppPages({
          data,
          keys: mapArrayBy(data, 'pageKey'),
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setAppPages({
          data: [],
          keys: {},
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for application pages. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const listAppPages = useCallback(
    (params) => {
      queryAppPages({ variables: params });
    },
    [queryAppPages],
  );

  const setPageProps = useCallback(
    (props) => {
      setPagePropsLocal(props);
    },
    [setPagePropsLocal],
  );

  return {
    listAppPages,
    setPageProps,
    appPages,
    loading,
    pageProps,
  };
};
