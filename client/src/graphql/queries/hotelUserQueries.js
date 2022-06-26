import gql from 'graphql-tag';

const HOTEL_USER_LIST_QUERY = gql`
  query ($params: HotelUserFilter, $pagination: PaginationAndSortingInput) {
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
  }
`;

const hotelUserQueries = {
  list: HOTEL_USER_LIST_QUERY,
};

export { hotelUserQueries };
