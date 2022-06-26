import gql from 'graphql-tag';

const GUEST_LEDGER_LIST_QUERY = gql`
  query ($params: GuestLedgerFilter, $pagination: PaginationAndSortingInput) {
    guestLedgerListGetByHotelCode(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        hotelCode
        hotelCodeTypeId
        startDate
        endDate
        columnsCfg {
          title
          valueTypeId
          fieldName
        }
        items {
          id
          hotelCode
          hotelId
          businessDate
          rewardLevel
          numberOfGuest
          roomType
          roomIdentifier
          roomSharedWith
          groupCode
          arrivalDate
          numberOfNight
          departureDate
          folio
          settlementCode
          outstandingAmount
          settlementType
          authorizedLimitAmount
          incidental
          roomRate
          rateCode
          variance
          confirmationNumber
          reservationKey
          sourceId
          etlFileName
          etlIngestDatetime
        }
      }
    }
  }
`;

const GUEST_LEDGER_GETFILTERS_QUERY = gql`
  query ($params: GuestLedgerFilterList, $pagination: PaginationAndSortingInput) {
    guestLedgerListGetFiltersByHotelCode(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        hotelCode
        hotelCodeTypeId
        startDate
        endDate
        filterType
        items {
          filterType
          values
        }
      }
    }
  }
`;

const guestLedgerQueries = {
  list: GUEST_LEDGER_LIST_QUERY,
  getFilters: GUEST_LEDGER_GETFILTERS_QUERY,
};

export { guestLedgerQueries };
