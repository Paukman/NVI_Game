import { getText } from '../../utils/localesHelpers';

/**
 * This is columns configuration for downloading functionality
 */
export const downloadHeaders = (reportType, ARReport) => {
  const downloadHeaders = [
    {
      accessor: 'name',
      title:
        reportType === ARReport.reportTypes.PROPERTY ? getText('arAging.accountName') : getText('arAging.property'),
    },
    ...(reportType === ARReport.reportTypes.PROPERTY && { accessor: 'mappedTo', title: getText('arAging.mappedTo') }),
    { accessor: 'due030', title: getText('arAging.thirtyDays') },
    { accessor: 'due3160', title: getText('arAging.sixtyDays') },

    { accessor: 'due6190', title: getText('arAging.ninetyDays') },
    { accessor: 'due91120', title: getText('arAging.hundredDays') },
    { accessor: 'dueOver120', title: getText('arAging.hundredPlusDays') },
    { accessor: 'total', title: getText('arAging.totalAR') },
  ];
  return reportType === ARReport.reportTypes.PROPERTY
    ? downloadHeaders
    : downloadHeaders.filter((header) => header.accessor !== 'mappedTo');
};

export const downloadHeadersCSV = (reportType, ARReport) => {
  return {
    name: {
      Header:
        reportType === ARReport.reportTypes.PROPERTY ? getText('arAging.accountName') : getText('arAging.property'),
    },
    ...(reportType === ARReport.reportTypes.PROPERTY && {
      mappedTo: {
        Header: getText('arAging.mappedTo'),
      },
    }),
    due030: {
      Header: getText('arAging.thirtyDays'),
    },
    due3160: {
      Header: getText('arAging.sixtyDays'),
    },

    due6190: {
      Header: getText('arAging.ninetyDays'),
    },
    due91120: {
      Header: getText('arAging.hundredDays'),
    },
    dueOver120: {
      Header: getText('arAging.hundredPlusDays'),
    },
    total: {
      Header: getText('arAging.totalAR'),
    },
  };
};
