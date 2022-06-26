const config = {
  name: 'HotelUser',
  queries: [
    {
      name: `hotelUserList`,
      method: 'list',
      query: `query($params: HotelUserFilter, $pagination: PaginationAndSortingInput) {
        hotelUserList(params: $params, pagination: $pagination) {
          code
          errors {
            name
            messages
          }
          data {
            id
            username
            avatarUrl
            firstName
            lastName
            gender
            email
            businessPhoneNumber
            homePhoneNumber
            cellPhoneNumber
            altPhoneNumber
            faxNumber
            country
            state
            city
            postalCode
            address1
            address2   
          }
        }
      }`,
      message: 'fetching Hotel User List',
    },
  ],
};

module.exports = {
  config,
};
