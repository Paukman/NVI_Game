import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

/**
 * TODO: Use real query as soon as it is ready
 */
export const LIST_SIDE_BAR_ITEMS = gql`
  query ($params: AppSideBarMenuFilter, $pagination: PaginationAndSortingInput) {
    appSideBarMenuList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        parentId
        itemStatusId
        orderNo
        pageId
        itemName
        itemIcon
        appPage {
          pagePath
          pageTitle
          pageComponent
          pageLayout
          pageKey
          redirectUrl
        }
      }
    }
  }
`;

export const useSideBar = () => {
  const [sideBarItems, setSideBarItems] = useState({ data: [], errors: [] });

  const [querySideBarItems, { loading }] = useLazyQuery(LIST_SIDE_BAR_ITEMS, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: (response) => {
      setSideBarItems({
        data: [],
        errors: [{ name: '', messages: [`Something went wrong when querying side bar menu items. Please try later`] }],
      });
    },
    onCompleted: (response) => {
      try {
        const result = response.appSideBarMenuList || {};
        const tmpItems = Array.isArray(result.data) ? result.data : [];
        const newItems = tmpItems.map((item) => {
          const appPage = item.appPage || {};
          return {
            id: item.id,
            parentId: item.parentId,
            orderNo: item.orderNo,
            label: item.itemName || appPage.pageTitle,
            iconName: item.itemIcon,
            selectable: !!item.appPage,
            url: appPage.redirectUrl || appPage.pagePath,
            alt: item.itemName || appPage.pageTitle,
            pageKey: appPage.pageKey,
          };
        });

        setSideBarItems({
          data: newItems,
          errors: Array.isArray(result.errors) ? result.errors : [],
        });
      } catch (ex) {
        setSideBarItems({
          data: [],
          errors: [
            {
              name: '',
              messages: [
                `Something went wrong as there is no response from the server for side bar menu. Please try later`,
              ],
            },
          ],
        });
      }
    },
  });

  const listSideBarItems = useCallback(
    (params) => {
      querySideBarItems({ variables: params });
    },
    [querySideBarItems],
  );

  return {
    listSideBarItems,
    sideBarItems,
    loading,
  };
};
