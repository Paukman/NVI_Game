import { getText } from '../../utils/localesHelpers';

export const downloadHeaders306090CSV = (items) => {
  return {
    ...items.reduce((accu, title) => {
      return {
        ...accu,
        [title.field]: {
          Header: title.headerName === 'Property' ? title.headerName : `${title.headerName} (${title.parentTitle})`,
        },
      };
    }, {}),
  };
};

export const download306090Headers = (items) => [
  ...(items.reduce((accu, title) => {
    return [
      ...accu,
      {
        accessor: title.field,
        title: title.headerName === 'Property' ? title.headerName : `${title.headerName} (${title.parentTitle})`,
      },
    ];
  }, []) || []),
  ...[{}],
];
