import React, { memo, Fragment, useContext, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { columnsConfig } from './columnsConfig';
import { Button, ButtonDownloadAs, ToolBar, ToolBarItem, Toggle, Search } from 'mdo-react-components';
import logger from '../../utils/logger';
import { getText, search } from '../../utils/localesHelpers';
import { isEmpty } from 'lodash';
import { HotelSelector, DataLoading, DisplayNoData, PaginatedDataTable, IfPermitted } from 'components';
import { strReplace } from '../../utils/formatHelpers';
import { useAccountMapping } from '../../graphql/useAccountMapping';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';
import { buildDownloadData, buildDownloadableFilename } from '../../utils/downloadHelpers';
import { downloadHeaders } from './downloadHelpers';
import { CSVLink } from 'react-csv';
import { AccountManagementRemove } from './AccountManagementRemove';
import { useSalesManager } from '../../graphql';
import { getComparator, stableSort } from '../../utils/pageHelpers';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { useTableData } from 'hooks';
import { exportToXLSX } from '../../utils/downloadHelpers';

const csvColumns = {
  accountName: {
    Header: getText('accountManagement.accountName'),
  },
  hotelSalesManagerId: {
    Header: getText('accountManagement.salesManager'),
  },
  managementStatusId: {
    Header: getText('accountManagement.status'),
  },
};

let aRemove = '';

const AccountManagement = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { hotelId, selectHotelId } = useContext(GlobalFilterContext);
  const { hotels, hotelsMap, loadingList } = useContext(HotelContext);
  const { listAccounts, removeAccount, listOfAccounts, accountRemove } = useAccountMapping();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [removeTmpAccount, setRemoveTmpAccount] = useState(null);
  const [operationAccount, setOperationAccount] = useState('');
  const [errorInfo, setErrorInfo] = useState({});
  const [account, setAccount] = useState([]);
  const [filters, setFilters] = useState({
    keyword: '',
  });
  const { salesManagers, listSalesManagers } = useSalesManager();
  const { onRequestTableData, tableData: resultData } = useTableData();

  useEffect(() => {
    listSalesManagers({
      params: {},
      pagination: {},
    });
  }, [listSalesManagers]);

  useEffect(() => {
    if (accountRemove === 'done') {
      setState({ data: state.data.filter((q) => q.id !== aRemove) });
    }
  }, [accountRemove]);

  const csvLink = useRef();
  const excelLink = useRef();

  const [state, setState] = useState({
    page: 1,
    pagesCount: 1,
    data: [],
  });

  const handleApplyFitlers = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (Array.isArray(listOfAccounts.data)) {
      const data = listOfAccounts.data.map((entry) => ({
        ...entry,
        hotelSalesManagerId: salesManagers.data.find((a) => a.id === entry.hotelSalesManagerId)?.displayName,
      }));

      setState({
        data: data,
      });
    }
  }, [listOfAccounts.data, salesManagers]);

  const [order, setOrder] = useState('');
  const [orderBy, setOrderBy] = useState('');

  useEffect(() => {
    if (Number(hotelId) > 0) {
      listAccounts({
        params: {},
        pagination: {
          page: 1,
          pageSize: 1000,
          sortBy: [
            {
              name: 'id',
              order: 'ASC',
            },
          ],
        },
      });
    } else if (!loadingList && hotels.length > 0) {
      hotels[0].id && hotels[0].id > 0 && !isNaN(hotels[0].id) ? setState(state) : setState(true);
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, listAccounts, hotels, selectHotelId]);

  useEffect(() => {
    const { code, errors } = listOfAccounts || {};

    if (isEmpty(errors)) {
      return;
    }

    if (code < 0) {
      setErrorInfo({
        errors,
      });
    } else {
      setErrorInfo({});
    }
  }, [listOfAccounts]);

  const handleClickEdit = (account) => {
    logger.log('Edit Account:', { account });
    history.push(strReplace(`${appPages.keys['account-management-edit'].url}`, { id: account.id }));
  };

  const handleClickRemove = (account) => {
    logger.log('Ask for permission to remove Account:', { account });
    setRemoveTmpAccount(account);
  };

  const handleRemove = async () => {
    logger.log('Remove Account:', { account: removeTmpAccount });
    aRemove = removeTmpAccount.id;
    removeAccount({ id: removeTmpAccount.id });
    setRemoveTmpAccount(null);
  };

  const downloadFileName = () => {
    return buildDownloadableFilename({
      hotelName: hotelsMap[hotelId]?.hotelName,
      reportName: DownloadableReportNames.accountManagement,
    });
  };

  const requestSort = (a, b) => {
    if (orderBy === a) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setOrder(b);
    }
    setOrderBy(a);
    setState({
      data: stableSort(
        items.map((a) => ({
          ...a,
          accountName: a.accountName,
          status: a.managementStatusId == 1 ? 'Not Managed' : a.managementStatusId == 100 ? 'Managed' : '',
          smName: a?.salesManager?.displayName || '',
        })),
        getComparator(b, a === 'managementStatusId' ? 'status' : a === 'hotelSalesManagerId' ? 'smName' : a),
      ),
    });
  };

  const handleDownloadAs = ({ value }) => {
    if (listOfAccounts?.data && Array.isArray(resultData) && resultData?.length) {
      const exportData = resultData.map((item) => ({ ['Account Name']: item['Account Name'] }));

      exportToXLSX(
        exportData,
        buildDownloadableFilename({
          hotelName: hotelsMap[hotelId]?.hotelName,
          reportName: DownloadableReportNames.accountManagement,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
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

  const items = useMemo(() => {
    let { data } = state;
    const { keyword } = filters;

    const newItems = data.filter((item) => {
      if (keyword.length > 0) {
        let found = false;

        if (search(String(item.accountName), keyword) !== -1) {
          found = true;
        }

        if (search(String(item.hotelSalesManagerId), keyword) !== -1) {
          found = true;
        }
        let status = item.managementStatusId == 1 ? 'Not Managed' : item.managementStatusId == 100 ? 'Managed' : '';
        if (search(String(status), keyword) !== -1) {
          found = true;
        }

        if (!found) {
          return false;
        }
      }

      return true;
    });

    return newItems;
  }, [filters, state]);

  return (
    <Fragment>
      <ToolBar>
        {/* <ToolBarItem>
          <HotelSelector
            name={'hotelId'}
            value={hotelId}
            disableClearable={true}
            onChange={(name, value) => {
              value && value > 0 && !isNaN(value) ? setState(state) : setState(true);
              selectHotelId(value);
            }}
          />
        </ToolBarItem> */}
        <ToolBarItem width='450px'>
          <Search
            label='Search'
            value={filters.keyword}
            name='keyword'
            onChange={(name, value, event) => {
              handleApplyFitlers({
                ...filters,
                keyword: value,
              });
            }}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Toggle
            value={0}
            onChange={(item) => {
              if (item === 1) {
                history.push(appPages.keys['account-mapping-sales'].url);
              }
            }}
            dataEl='toggleAccountManagement'
          >
            <div data-el='buttonMapping'>{getText('account.salesMapping')}</div>
            <div data-el='buttonAccounts'>{getText('account.mapping')}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <AccountManagementRemove
            hmgGlCode={removeTmpAccount}
            open={!!removeTmpAccount}
            onRemove={handleRemove}
            onCancel={() => {
              setRemoveTmpAccount(null);
            }}
          />
          <IfPermitted page='account-management' permissionType='create'>
            <Button
              iconName='Add'
              variant='tertiary'
              title={getText('generic.add')}
              alt='buttonCreateKpi'
              onClick={() => {
                history.push(appPages.keys['account-management-add'].url);
              }}
              dataEl='buttonAdd'
            />
          </IfPermitted>
        </ToolBarItem>
        {/* <ToolBarItem>
        <IfPermitted page='account-management' permissionType='import'>
          <Button
            iconName='CloudUpload'
            variant='tertiary'
            title={getText('generic.import')}
            alt='buttonCreateKpi'
            onClick={() => {
              history.push(appPages.keys['account-management-import'].url);
            }}
            dataE='buttonUpload'
            disabled={true}
          />
          </IfPermitted>
        </ToolBarItem> */}
        <ToolBarItem>
          <IfPermitted page='account-management' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              title={getText('generic.download')}
              onClick={handleDownloadAs}
              exclude={['pdf']}
              disabled={!items?.length}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      {loadingList && <DataLoading />}
      {!loadingList && listOfAccounts.errors.length === 0 && items?.length > 0 && (
        <Fragment>
          <PaginatedDataTable
            hasStripes={false}
            expandCollapePlacement={-1}
            subHeaders={columnsConfig({ onEdit: handleClickEdit, onRemove: handleClickRemove })}
            items={items}
            order={order}
            orderBy={orderBy}
            onRequestSort={requestSort}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            customPageSize={25}
            filtersActive={!!filters?.keyword}
            search={filters?.keyword ?? ''}
          />
          {!loadingList && listOfAccounts.data.length == 0 && <DisplayNoData message={getText('generic.emptyData')} />}
        </Fragment>
      )}
    </Fragment>
  );
});

AccountManagement.displayName = 'AccountManagement';

export { AccountManagement };
