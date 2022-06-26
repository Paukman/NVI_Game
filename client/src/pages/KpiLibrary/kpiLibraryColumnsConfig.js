import React, { useContext } from 'react';
import { getText } from '../../utils/localesHelpers';
import { DictionaryValue, KpiActions } from '../../components';

export const kpiLibraryColumnsConfig = (props) => {
  const { onActionClick, disabled } = props;

  return [
    {
      field: 'kpiName',
      headerName: getText('kpi.kpiName'),
      align: 'left',
      width: 250,
      sortable: true,
    },
    {
      field: 'kpiFormula',
      headerName: getText('kpi.kpiFormula'),
      width: 200,
      sortable: false,
      align: 'left',
    },
    {
      field: 'kpiDescription',
      headerName: getText('generic.description'),
      width: 'auto',
      minWidht: '200px',
      sortable: true,
      align: 'left',
    },
    {
      field: 'kpiCreatedBy',
      headerName: getText('kpi.kpiCreatedBy'),
      width: 200,
      align: 'left',
      sortable: true,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, id, value } = args;

        return <span>{dataRow.userCreated?.displayName ?? ''}</span>;
      },
    },
    {
      field: 'kpiCategoryId',
      headerName: getText('kpi.kpiCategory'),
      width: 150,
      align: 'left',
      sortable: true,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, id, value } = args;

        return <DictionaryValue dictionaryType={'kpi-category'} value={value} />;
      },
    },
    {
      field: 'action',
      headerName: '',
      width: 60,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow } = args;
        const disabledItems = [];

        if (dataRow.permissions.indexOf('update') === -1) {
          disabledItems.push(KpiActions.actions.EDIT);
        }

        if (dataRow.permissions.indexOf('remove') === -1) {
          disabledItems.push(KpiActions.actions.DELETE);
        }

        if (dataRow.permissions.indexOf('makeitprivate') === -1) {
          disabledItems.push(KpiActions.actions.MAKEPRIVATE);
        }

        if (dataRow.permissions.indexOf('shareglobally') === -1) {
          disabledItems.push(KpiActions.actions.SHAREGLOBALLY);
        }

        if (dataRow.permissions.indexOf('sharetoselected') === -1) {
          disabledItems.push(KpiActions.actions.SHARETOSELECTED);
        }

        return (
          <KpiActions
            onClick={(action) => onActionClick({ action, dataRow })}
            disabledItems={disabledItems}
            disabled={disabled}
          />
        );
      },
    },
  ];
};
