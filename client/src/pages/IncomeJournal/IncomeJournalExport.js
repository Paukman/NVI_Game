import { Button, Dropdown, InputDate, ToolBar, ToolBarItem } from 'mdo-react-components';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { DataLoading, HotelSelector } from '../../components';
import { HotelContext } from '../../contexts';
import { useIJExport } from '../../graphql/useIJExport';
import { buildDownloadableFilename, exportToXLSX } from '../../utils/downloadHelpers';
import { getText } from '../../utils/localesHelpers';
import { exportItems } from './constants';
import { ButtonGroup, StyledDate, StyledFrame } from './styled';

const IncomeJournalExport = memo(() => {
  const { hotels } = useContext(HotelContext);
  const { IJExportGetLoading, incomeJournalExportGet, getReportIJExport } = useIJExport();
  const [exportsData, setExports] = useState({
    headers: [],
    exportData: [],
  });
  const [filter, setFilter] = useState({
    exportType: 'Choose System',
    hotelId: hotels.length !== 0 ? hotels[0].id : null,
    startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    firstRowIsHeader: false,
  });

  useEffect(() => {
    if (hotels?.length !== 0) {
      onChange('hotels', hotels);
      onChange('hotelId', hotels[0]?.id);
    }
  }, [hotels]);

  useEffect(() => {
    if (incomeJournalExportGet?.data?.columnsCfg) {
      if (incomeJournalExportGet.errors.length > 0) {
        return;
      }

      const data = incomeJournalExportGet?.data;
      const headers = data?.columnsCfg ? data?.columnsCfg.map((item) => item?.name) : [];
      let exportData = [];
      if (data?.items && data?.items?.length !== 0) {
        data?.items.forEach((item) =>
          exportData.push(
            item?.columnsData.reduce(
              (acc, value, index) => ({
                ...acc,
                [headers[index] ? headers[index] : index]:
                  value?.value === null || value?.value === 'null' ? '' : `="${value?.value}"`,
              }),
              [],
            ),
          ),
        );
      }
      if (exportData.length === 0 && headers.length !== 0) {
        exportData.push(headers.reduce((acc, item, index) => ({ ...acc, [item ? item : index]: '' }), {}));
      }

      setExports({ ...exportsData, headers, exportData });
    }
  }, [incomeJournalExportGet]);

  const onClick = () => {
    getReportIJExport({
      params: filter,
    });
  };

  useEffect(() => {
    if (incomeJournalExportGet?.data && exportsData?.headers.length) {
      const { startDate, endDate } = filter; 
      const startDateComparasion = `${startDate.getFullYear()}-${startDate.getMonth()}-${startDate.getDate()}`;
      const endDateTimeComparasion = `${endDate.getFullYear()}-${endDate.getMonth()}-${endDate.getDate()}`;

      exportToXLSX(
        exportsData?.exportData,
        buildDownloadableFilename({
          ...(startDateComparasion == endDateTimeComparasion ? { date: startDate } : {startDate, endDate}),
          hotelName: hotels.find((hotel) => hotel.id === filter.hotelId)?.hotelName,
          exportType: `IJ_Export_to_${exportItems
            .find((item) => item.value == filter.exportType)
            ?.label.replaceAll(' ', '_')}`,
        }),
        'csv',
        '',
        { isHeader: filter.exportType !== 'MSD' ? true : false },
      );
    }
  }, [exportsData.exportData]);

  const isValid =
    Object.values(filter).find((item) => item === 'Choose System' || item === null) === undefined ? true : false;

  const onChange = (name, value) => {
    setFilter({ ...filter, [name]: value });
  };

  return (
    <StyledFrame>
      <ToolBarItem>
        <HotelSelector
          name={'hotelId'}
          label={'Property'}
          disableClearable
          value={filter.hotelId}
          onChange={onChange}
        />
      </ToolBarItem>
      <ToolBar>
        <StyledDate left>
          <InputDate
            label={getText('generic.startDate')}
            name='startDate'
            value={filter.startDate}
            maxDate={filter.endDate}
            onChange={onChange}
            dataEl='inputDateStartDate'
            errorMsg={getText('generic.dateErrorText')}
          />
        </StyledDate>
        <StyledDate>
          <InputDate
            label={getText('generic.endDate')}
            name='endDate'
            value={filter.endDate}
            minDate={filter.startDate}
            maxDate={new Date()}
            onChange={onChange}
            dataEl='inputDateEndDate'
            errorMsg={getText('generic.dateErrorText')}
          />
        </StyledDate>
      </ToolBar>
      <ToolBarItem>
        <Dropdown
          label={getText('incomeJournal.exportDropDown')}
          value={filter.exportType}
          name={'exportType'}
          onChange={onChange}
          items={exportItems}
          placeHolder={getText('incomeJournal.exportChosen')}
          dataEl={getText('incomeJournal.nameOfIJExport')}
        />
      </ToolBarItem>
      <ToolBarItem>
        <ButtonGroup>
          <Button
            variant='default'
            text={getText('generic.reset')}
            onClick={() => {
              setFilter({
                exportType: 'Choose System',
                hotelId: hotels.length !== 0 ? hotels[0].id : null,
                startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
                endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
                firstRowIsHeader: false,
              });
            }}
          />
          <Button variant='success' text={getText('generic.export')} onClick={onClick} disabled={!isValid} />
        </ButtonGroup>
      </ToolBarItem>
      {IJExportGetLoading && <DataLoading />}
    </StyledFrame>
  );
});

IncomeJournalExport.displayName = 'IncomeJournalExport';

export { IncomeJournalExport };
