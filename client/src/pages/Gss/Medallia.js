import React, { memo, Fragment, useContext, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Button,
  ToolBar,
  ToolBarItem,
  ButtonDownloadAs,
  YearSelector,
  RecursiveDataTable,
  Dropdown,
  Search,
} from 'mdo-react-components';
import {
  HotelSelector,
  DataContainer,
  DisplayApiErrors,
  DisplayNoData,
  DataLoading,
  IfPermitted,
} from '../../components';
import { buildReportFilename, exportToXLSX, findDepth } from '../../utils/downloadHelpers';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';
import { useGSSReports } from '../../graphql/useGSSReports';
import { CellRenderer } from '../ProfitAndLoss/CellRenderer';
import { MHeaderCell } from './styled';
import { search } from '../../utils/localesHelpers';
import { useLocation } from 'react-router-dom';
import { ToastContext } from '../../components/Toast';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { getText } from '../../utils/localesHelpers';
import { columnNamesMappingGssMedallia } from './util';
import { useTableData } from 'hooks';

let baseData = [];
let priorityValue, catId;
let isNewSearch;

const Medallia = memo(() => {
  const { hotelId, assignGlobalValue } = useContext(GlobalFilterContext);
  const { loadingList, hotelsMap } = useContext(HotelContext);

  const {
    listGssMedalliaReportGet,
    gssMedalliaReportGet,
    listgssMedalliaPriorityList,
    gssMedalliaPriorityList,
    listgssMedalliaPrioritySet,
    gssMedalliaPrioritySet,
  } = useGSSReports();

  const [filters, setFilters] = useState({
    hotelId: hotelId,
    year: new Date().getFullYear(),
  });
  const { onRequestTableData, tableData: resultData } = useTableData();
  const [gssReport, setGssReport] = useState([]);
  const [formatedReport, setFormatedReport] = useState([]);
  const [subHeaders, setSubHeaders] = useState([]);
  const [priorities, setPriorities] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => ({ label: q, value: q })));
  const [reportRequested, setReportRequested] = useState(false);
  const { hotels } = useContext(HotelContext);
  const [keyword, setKeyword] = useState('');
  const location = useLocation();
  const { showToast } = useContext(ToastContext);

  useMemo(() => {
    if (!filters.hotelId && hotels.length !== 0) {
      setFilters({
        ...filters,
        hotelId: hotels[0].id,
      });
    }
  }, [hotels, setFilters, filters]);

  useEffect(() => {
    if (location && location.state && location.state.id) {
      setFilters({ ...filters, hotelId: Number(location.state.id) });
    }
  }, [location]);

  useEffect(() => {
    if (gssMedalliaPriorityList && gssMedalliaPriorityList.data.length) {
      //setPriorities(gssMedalliaPriorityList.data[0].priorities);
      setPriorities([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => ({ label: q, value: q })));
    }
  }, [gssMedalliaPriorityList]);

  useEffect(() => {
    if (gssMedalliaPrioritySet) {
      if (gssMedalliaPrioritySet === 'done') {
        const cdata = gssReport[0].children.map((q) => {
          if (q.id === catId) {
            q.priority = priorityValue;
          }
          return q;
        });
        baseData = JSON.parse(JSON.stringify(cdata));
        setGssReport([
          {
            children: cdata,
          },
        ]);
        priorityValue = '';
        catId = '';
      } else {
        showToast({ message: gssMedalliaPrioritySet, severity: 'error' });
      }
    }
  }, [gssMedalliaPrioritySet]);

  const handlePrioritySet = (value, dataRow) => {
    priorityValue = value;
    catId = dataRow.id;
    listgssMedalliaPrioritySet({
      params: {
        id: dataRow.id,
        priority: value,
      },
    });
  };

  useEffect(() => {
    if (gssMedalliaReportGet && gssMedalliaReportGet.data.length) {
      const rawReport = gssMedalliaReportGet.data[0];

      if (!rawReport) {
        setGssReport([]);
        return;
      }

      const columnsMap = {};
      const columns = [
        {
          headerName: 'Property',
          field: 'description',
          minWidth: '250px',
          width: '250px',
          // eslint-disable-next-line
          onRender: (e) => (
            <span
              style={{
                fontWeight: e?.dataRow?.topLevelHeaders ? 700 : 300,
                marginLeft: e?.dataRow?.isMedalliaChild ? '30px' : '0',
              }}
            >
              {e?.value}
            </span>
          ),
          background: '#ffffff',
          color: '#3b6cb4',
          hasBorder: true,
        },
      ];

      rawReport.columnsCfg.forEach((column, idx) => {
        const field = column.name;
        columns.push({
          headerName: column.name,
          field,
          ...(idx % 2 === 0 && { bgColor: true }),
          headerAlign: 'center',
          align: 'right',
          minWidth: '70px',
          // eslint-disable-next-line
          onRender: (e) => (
            <div style={{ display: 'flex', justifyContent: 'center', width: '70px', fontWeight: 300 }}>{e?.value}</div>
          ),
          hasBorder: [11].indexOf(idx) !== -1,

          //colors.blue does not work as theme is unavailable
          color: '#3b6cb4',
        });
        columnsMap[`${idx}`] = field;
      });
      columns.push({
        headerName: 'Priority',
        headerAlign: 'center',
        align: 'right',
        color: '#3b6cb4',
        minWidth: '80px',
        // eslint-disable-next-line
        onRender: ({ dataRow }) => {
          if (!dataRow.header) {
            return dataRow?.permissions?.length ? (
              <div style={{ fontSize: '12px', minWidth: '30px', display: 'flex', justifyContent: 'center' }}>
                <Dropdown
                  value={dataRow.priority || 0}
                  disabled={false}
                  onChange={(name, value) => {
                    handlePrioritySet(value, dataRow);
                  }}
                  items={priorities}
                />
              </div>
            ) : (
              ''
            );
          } else {
            return '';
          }
        },
      });

      columns[columns.length - 1].hasBorder = false;

      const tableData = [];

      rawReport.sections.forEach((section, sIdx) => {
        const { category, items } = section;

        // This is a regular section with data

        // Insert header row
        tableData.push({
          id: category?.name || '',
          description: category?.name || '',
          glCode: '',
          topLevelHeaders: true,
        });
        if (items && items.length) {
          tableData.push(
            ...items.map((item, yid) => {
              const { columnsData, ...other } = item;
              return {
                ...other,
                isMedalliaChild: true,
                isHGap: items.length - 1 === yid,
                ...columnsData.reduce((acc, column, idx) => {
                  acc[columnsMap[`${idx}`]] = column;
                  return acc;
                }, {}),
              };
            }),
          );
        }
      });
      setSubHeaders(columns);
      isNewSearch = true;
      baseData = JSON.parse(JSON.stringify(tableData));
      setGssReport([{ children: tableData }]);
    }
  }, [gssMedalliaReportGet]);

  useEffect(() => {
    let gssFormatData = gssReport && gssReport.length ? gssReport[0].children : [];
    let gssValues = [];
    if (Array.isArray(baseData)) {
      const values = gssFormatData.map((val) => Object.values(val));
      values.forEach((val) => {
        gssValues.push(
          val.map((record) =>
            isNaN(record)
              ? record?.toString()
              : record % 1 != 0
              ? Number(record).toFixed(2)?.toString()
              : record?.toString(),
          ),
        );
      });
      gssFormatData.forEach((val, index0) => {
        const recordKeys = Object.keys(val);
        recordKeys.forEach((key, index1) => (val[key] = gssValues[index0][index1]));
      });
      setFormatedReport(gssFormatData);
    }
  }, [gssReport]);

  const searchItems = useMemo(() => {
    if (baseData.length) {
      let nf = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
      });
      const newItems = formatedReport.reduce((val, item) => {
        let obj = {};
        if (keyword) {
          let flag = [];
          const recordKeys = Object.keys(item);
          recordKeys.forEach((key) => (search(item[key], keyword) !== -1 ? flag.push(keyword) : ''));
          flag.length > 0 ? val.push(item) : '';
        } else {
          Object.entries(item).filter(([key, value]) => {
            if (value && !isNaN(value)) {
              obj[key] = nf.format(value);
            } else {
              obj[key] = value;
            }
          });
          val.push(obj);
        }
        return val;
      }, []);
      return [{ children: newItems }];
    } else {
      return [];
    }
  }, [keyword, formatedReport]);

  const handleDownloadAs = ({ value }) => {
    if (gssMedalliaReportGet?.data?.[0]?.columnsCfg) {
      let indents = [];
      findDepth(searchItems[0].children, indents);
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          hotelName: hotelsMap[filters.hotelId]?.hotelName,
          year: filters.year,
          reportName: DownloadableReportNames.gssMedaliya,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          indents,
          // subHeader: ['', '', 'Actual', 'Budget', 'Variance'],
          // span: [
          //   [1, 1],
          //   [2, 2],
          //   [3, 4],
          //   [5, 6],
          //   [7, 8],
          // ],
        },
      );
    }
  };

  const handleFilterChange = (name, value) => {
    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);
    if (reportRequested) {
      setReportRequested(false);
    }
  };

  const handleReport = () => {
    //   setGssReport([]);
    listgssMedalliaPriorityList({
      params: {
        hotelId: filters.hotelId,
      },
    });
    listGssMedalliaReportGet({
      params: filters,
    });
    if (!reportRequested) {
      setReportRequested(true);
    }
  };

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector
            name='hotelId'
            value={filters.hotelId}
            disableClearable={true}
            onChange={(name, value) => {
              assignGlobalValue(name, value);
              const newFilters = {
                ...filters,
                [name]: value,
              };
              setFilters(newFilters);
            }}
          />
        </ToolBarItem>
        <ToolBarItem>
          <YearSelector
            name='year'
            label='Year'
            value={filters.year}
            yearSince={new Date().getFullYear() - 1}
            yearsTo={new Date().getFullYear()}
            onChange={handleFilterChange}
            maxHeight={'200px'}
            dataEl='yearSelector'
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={reportRequested ? 'Refresh' : ''}
            text={reportRequested ? '' : getText('generic.go')}
            title={getText(`generic.${reportRequested ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => handleReport()}
            disabled={loadingList}
            dataEl='buttonGo'
          />
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem width='300px'>
          <Search
            label='Search'
            value={''}
            name='keyword'
            onChange={(name, value, event) => {
              setKeyword(value);
            }}
            dataEl='searchInput'
            timeoutMs={1000}
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <IfPermitted page='medallia' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              onClick={handleDownloadAs}
              exclude={['pdf']}
              dataEl={'buttonDownloadAs'}
              disabled={gssMedalliaReportGet.data.length === 0}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        {loadingList && <DataLoading />}
        {!loadingList &&
          gssMedalliaReportGet &&
          gssMedalliaReportGet.errors &&
          gssMedalliaReportGet.errors.length !== 0 && <DisplayApiErrors errors={gssMedalliaReportGet.errors} />}
        {!loadingList &&
          !(
            gssMedalliaReportGet?.data &&
            gssMedalliaReportGet?.data?.length > 0 &&
            gssMedalliaReportGet?.data[0].sections &&
            gssMedalliaReportGet?.data[0].sections?.length > 0
          ) &&
          gssMedalliaReportGet.errors &&
          gssMedalliaReportGet.errors.length === 0 && (
            <DisplayNoData
              message={reportRequested ? getText('generic.noReportDataForTheYear') : getText('generic.selectFilters')}
            />
          )}

        {!loadingList &&
          gssMedalliaReportGet?.data &&
          gssMedalliaReportGet?.data?.length > 0 &&
          gssMedalliaReportGet?.data[0].sections &&
          gssMedalliaReportGet?.data[0].sections?.length > 0 &&
          gssMedalliaReportGet?.errors &&
          gssMedalliaReportGet?.errors?.length === 0 &&
          searchItems?.length > 0 && (
            <DataContainer obsoleteData={!reportRequested}>
              <RecursiveDataTable
                expandCollapePlacement={-1}
                key={`${filters.year}-${hotelId}`}
                data={searchItems}
                subHeaders={subHeaders}
                freezeColumns={0}
                stickyHeaders={true}
                columnNamesMapping={columnNamesMappingGssMedallia(subHeaders)}
                onRequestTableData={onRequestTableData}
              />
            </DataContainer>
          )}
      </Fragment>
    </Fragment>
  );
});

Medallia.displayName = 'Medallia';

export { Medallia };
