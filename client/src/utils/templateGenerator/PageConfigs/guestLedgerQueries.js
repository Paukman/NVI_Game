const config = {
  name: 'GuestLedger',
  queries: [
    {
      name: `guestLedgerListGetByHotelCode`,
      method: 'list',
      query: `query ($params: GuestLedgerFilter, $pagination: PaginationAndSortingInput) {
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
          }`,
      message: 'fetching Guest Ledger List',
    },
    {
      name: `guestLedgerListGetFiltersByHotelCode`,
      method: 'getFilters',
      query: `
      query($params: GuestLedgerFilterList, $pagination: PaginationAndSortingInput) {
        guestLedgerListGetFiltersByHotelCode(params: $params, pagination: $pagination) {
          code
          errors {
            name
            messages
          }
          data {
            hotelCode,
            hotelCodeTypeId,
            startDate,
            endDate,
            filterType
            items {
              filterType
              values
            }
          }
        }
      }`,
      message: 'fetching Guest Ledger List',
    },
  ],
};

module.exports = {
  config,
};
