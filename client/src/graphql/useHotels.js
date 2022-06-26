import { useCallback, useState } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';
import { mapArrayBy } from 'mdo-react-components';
import { stableSort, getComparator } from '../utils/pageHelpers';
import apolloClient from './apolloClient';
import { buildErrors } from '../utils/apiHelpers';
import logger from '../utils/logger';

export const LIST_HOTELS_QUERY = gql`
  query ($params: HotelFilter, $pagination: PaginationAndSortingInput) {
    hotelList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        hotelStatusId
        hotelName
        hotelCode
        country
        state
        city
        postalCode
        address1
        address2
        timeZone
        availableRoomQty
        hotelGroup {
          id
          groupName
        }
        brand {
          id
          brandName
        }
        brandAffiliation {
          id
          affiliationName
        }
        defaultAddress {
          id
          hotelId
          referenceId
          addressName
          address1
          address2
          phoneNumber
          faxNumber
          email
          contactName
          notes
          postalCode
          country {
            id
            countryName
          }
          stateProvince {
            id
            stateProvinceName
          }
          city {
            id
            cityName
          }
        }
        attention

        addresses {
          id
          hotelId
          referenceId
          addressName
          address1
          address2
          phoneNumber
          faxNumber
          email
          contactName
          notes
          postalCode
          country {
            id
            countryName
          }
          stateProvince {
            id
            stateProvinceName
          }
          city {
            id
            cityName
          }
        }
      }
    }
  }
`;

export const useHotels = () => {
  const [hotelsData, setHotelsData] = useState({
    hotels: [],
    hotelsGroups: [],
    hotelsMap: {},
    hotelsGroupsMap: {},
    ...buildErrors(),
  });
  const [hotel, setHotel] = useState(null);

  const [queryListHotels, { loading: loadingList }] = useLazyQuery(LIST_HOTELS_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (response) => {
      const result = response.hotelList || {};
      const hotelsGroups = [];
      const hotelsGroupsMap = {};
      const hotelsWithNoGroups = [];

      const data = (result.data || []).map((item) => {
        const id = Number(item.id);
        const hotel = {
          ...item,
          id,
        };
        if (Array.isArray(item.hotelGroup)) {
          item.hotelGroup.forEach((groupItem) => {
            const groupId = Number(groupItem.id);

            if (!hotelsGroupsMap[groupId]) {
              const hotelGroup = {
                ...groupItem,
                id: groupId,
                hotels: [],
              };

              hotelsGroups.push(hotelGroup);

              hotelsGroupsMap[groupId] = hotelGroup;
            }

            hotelsGroupsMap[groupId].hotels.push(hotel);
          });
          if (item.hotelGroup.length === 0) {
            hotelsWithNoGroups.push(hotel);
          }
        }

        return hotel;
      });

      const sortHotelGroup = hotelsGroups.sort((a, b) =>
        a.groupName > b.groupName ? 1 : b.groupName > a.groupName ? -1 : 0,
      );
      const hotelsMap = mapArrayBy(data, 'id');
      const hotelsWithNoGroupsMap = mapArrayBy(hotelsWithNoGroups, 'id');

      setHotelsData({
        hotels: data,
        hotelsMap,
        hotelsGroups: sortHotelGroup,
        hotelsGroupsMap,
        hotelsWithNoGroupsMap,
        ...buildErrors(),
      });
    },
    onError: (response) => {
      logger.error('Something went wrong when querying hotels list:', response);

      setHotelsData({
        hotels: [],
        hotelsMap: {},
        hotelsGroups: [],
        hotelsGroupsMap: {},
        hotelsWithNoGroupsMap: [],
        ...buildErrors({
          errors: [
            {
              name: '',
              messages: [`Something went wrong when querying hotels list. Please try later`],
            },
          ],
        }),
      });
    },
  });

  const [queryGetHotel, { loading: loadingItem }] = useLazyQuery(LIST_HOTELS_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      setHotel(newCodes);
    },
  });

  const listHotels = useCallback(
    (params) => {
      setHotelsData({
        hotels: [],
        hotelsMap: {},
        hotelsGroups: [],
        hotelsGroupsMap: {},
        hotelsWithNoGroupsMap: [],
        ...buildErrors(),
      });

      queryListHotels({ variables: { params } });
    },
    [queryListHotels],
  );

  const getHotel = useCallback(
    (id) => {
      queryGetHotel(id);
    },
    [queryGetHotel],
  );

  const getPortfolioHotelIds = useCallback(
    (portoflio) => {
      if (!portoflio) {
        return [];
      }

      if (portoflio.hotelId) {
        return [portoflio.hotelId];
      }

      if (hotelsData.hotelsGroupsMap[portoflio.hotelGroupId]) {
        return hotelsData.hotelsGroupsMap[portoflio.hotelGroupId]?.hotels.map((hotel) => hotel.id);
      }

      return hotelsData.hotels.map((hotel) => hotel.id);
    },
    [hotelsData],
  );

  return {
    listHotels,
    getHotel,
    getPortfolioHotelIds,
    loadingList,
    loadingItem,
    hotels: hotelsData.hotels,
    hotelsMap: hotelsData.hotelsMap,
    hotelsGroups: hotelsData.hotelsGroups,
    hotelsGroupsMap: hotelsData.hotelsGroupsMap,
    hotelsWithNoGroupsMap: hotelsData.hotelsWithNoGroupsMap,
    hotel,
    errors: hotelsData.errors,
  };
};
