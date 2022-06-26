import gql from 'graphql-tag';

import { useCallback, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import apolloClient from './apolloClient';

import { mapArrayBy } from 'mdo-react-components';

export const LIST_COMPANIES_QUERY = gql`
  query ($params: CompanyFilter, $pagination: PaginationAndSortingInput) {
    companyList(params: $params, pagination: $pagination) {
      code
      errors {
        name
        messages
      }
      data {
        id
        companyStatusId
        companyTypeId
        companyName
        phoneNumber
        faxNumber
        email
        website
        defaultAddressId
        contactName
        terms
        notes
        permissions
        createdBy
        updatedBy
        createdAt
        updatedAt
        userCreated {
          displayName
        }
        userUpdated {
          displayName
        }
        organization {
          companyName
        }

        defaultAddress {
          id
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

        addresses {
          id
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

export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState(null);
  const [companiesMap, setCompaniesMap] = useState(null);

  const [queryListCompanies, { loading: loadingList }] = useLazyQuery(LIST_COMPANIES_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      try {
        const data = newData.companyList.data || [];

        const companiesMap = mapArrayBy(data, 'id');

        setCompanies(data);
        setCompaniesMap(companiesMap);
      } catch (ex) {
        console.log(ex);
      }
    },
  });

  const [queryGetCompany, { loading: loadingItem }] = useLazyQuery(LIST_COMPANIES_QUERY, {
    client: apolloClient,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (newData) => {
      setCompany(newCodes);
    },
  });

  const listCompanies = useCallback(
    (params) => {
      queryListCompanies({ variables: params });
    },
    [queryListCompanies],
  );

  const getCompany = useCallback(
    (id) => {
      queryGetCompany(id);
    },
    [queryGetCompany],
  );

  return {
    listCompanies,
    getCompany,
    loadingList,
    loadingItem,
    companies,
    companiesMap,
    company,
  };
};
