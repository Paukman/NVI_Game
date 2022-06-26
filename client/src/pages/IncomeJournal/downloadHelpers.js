import { getText } from '../../utils/localesHelpers';
import { camelCase } from 'lodash';
/**
 * This is columns configuration for downloading functionality
 */
export const downloadHeaders = [
  {
    accessor: 'reportSourceName',
    title: getText('incomeJournal.reportName'),
  },
  {
    accessor: 'pmsCode',
    title: getText('incomeJournal.pmsCode'),
  },
  {
    accessor: 'description',
    title: getText('generic.description'),
  },
  {
    accessor: 'amount',
    title: getText('incomeJournal.amount'),
  },
  {
    accessor: 'pmsTypeName',
    title: getText('incomeJournal.type'),
  },
  {
    accessor: 'hmgGlCode',
    title: getText('generic.hmgGlCode'),
  },
];

export const downloadExportHeaders = (headers) =>
  headers.map((item, index) => ({ accessor: item ? item : index, title: item ? item : index }));
