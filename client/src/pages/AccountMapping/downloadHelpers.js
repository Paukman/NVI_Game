import { getText } from '../../utils/localesHelpers';

/**
 * This is columns configuration for downloading functionality
 */
export const downloadHeaders = [
  {
    accessor: 'accountName',
    title: getText('accountManagement.accountName'),
  },
  {
    accessor: 'hotelSalesManagerId',
    title: getText('accountManagement.salesManager'),
  },
  {
    accessor: 'managementStatusId',
    title: getText('accountManagement.status'),
  },
];
