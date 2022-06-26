import React, { useContext } from 'react';
import { getText } from '../../utils/localesHelpers';
import { HmgGlCodeSelector, PmsTypeSelector, useIfPermitted } from '../../components';
import { GridItem } from 'mdo-react-components';
import { MdoWrapper } from './styled';
import { AmountCellRenderer } from './AmountCellRenderer';

export const mappingReportColumnsConfig = (args) => {
  const { onChangePmsType, onChangeGlCode, hotelId, isIncomeJournalMappingLockSet, permitted } = args;
  return [
    {
      field: 'reportSourceName',
      headerName: getText('incomeJournal.reportName'),
      align: 'left',
      width: 200,
      sortable: true,
    },
    {
      field: 'pmsCode',
      headerName: getText('incomeJournal.pmsCode'),
      width: 200,
      sortable: true,
      align: 'left',
    },
    {
      field: 'description',
      headerName: getText('generic.description'),
      width: 'auto',
      sortable: true,
      align: 'left',
    },
    {
      field: 'amount',
      headerName: getText('incomeJournal.amount'),
      width: 150,
      align: 'right',
      headerAlign: 'right',
      sortable: true,
      onRender: AmountCellRenderer,
    },
    {
      field: 'pmsTypeName',
      headerName: getText('incomeJournal.type'),
      width: 200,
      align: 'left',
      sortable: true,
      // eslint-disable-next-line
      disableFlex: true,
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, value } = args;

        if (!dataRow.id || isIncomeJournalMappingLockSet) {
          return <span>{value}</span>;
        }

        return (
          <PmsTypeSelector
            name={`pms-${dataRow.id}`}
            value={dataRow.pmsTypeId}
            onChange={(name, value) => {
              if (typeof onChangePmsType === 'function') {
                onChangePmsType({ reportItem: dataRow, value });
              }
            }}
            excludeItems={PmsTypeSelector.notAllowedWithAll}
            tableDropDownFontSize={true}
            disabled={!permitted}
          />
        );
      },
    },
    {
      field: 'hmgGlCode',
      headerName: getText('generic.hmgGlCode'),
      width: 300,
      align: 'left',
      sortable: true,
      disableFlex: true,
      // eslint-disable-next-line
      onRender: (args) => {
        // eslint-disable-next-line
        const { dataRow, value } = args;
        if (!dataRow.id || isIncomeJournalMappingLockSet) {
          return <span>{value}</span>;
        }

        return (
          <HmgGlCodeSelector
            name={`hmg-gl-code-${dataRow.id}`}
            hotelId={hotelId}
            value={dataRow.hmgGlCode}
            onChange={(_name, value) => {
              if (typeof onChangeGlCode === 'function') {
                onChangeGlCode({ reportItem: dataRow, value });
              }
            }}
            tableDropDownFontSize={true}
            disabled={!permitted}
          />
        );
      },
    },
  ];
};
