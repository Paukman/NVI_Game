import React, { memo, Fragment, useContext, useRef, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { columnsConfig } from './columnsConfig';
import { Button, ButtonDownloadAs, ToolBar, ToolBarItem, Toggle, Search } from 'mdo-react-components';
import logger from '../../utils/logger';
import { getText, search } from '../../utils/localesHelpers';
import {
  DataLoading,
  DataContainer,
  DisplayNoData,
  PaginatedDataTable,
  GroupSelector,
  IfPermitted,
} from '../../components';
import { buildDownloadableFilename } from '../../utils/downloadHelpers';
import { strReplace } from '../../utils/formatHelpers';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';
import { buildDownloadData } from '../../utils/downloadHelpers';
import { downloadHeaders } from './downloadHelpers';
import { useSalesManager } from '../../graphql';
import { SalesManagerAddEdit } from './SalesManagerAddEdit';
import { SalesManagerRemove } from './SalesManagerRemove';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { useTableData } from 'hooks';
import { exportToXLSX } from '../../utils/downloadHelpers';

const pageSize = 50;

const csvColumns = {
  firstName: {
    Header: 'First Name',
  },
  lastName: {
    Header: 'Last Name',
  },
  address: {
    Header: 'Address',
  },
  phone: {
    Header: 'Phone No',
  },
  email: {
    Header: 'Email Id',
  },
};

const SalesManagers = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { hotelId, selectHotelId, portfolio, selectPortfolio } = useContext(GlobalFilterContext);
  const { hotelsMap, loadingList } = useContext(HotelContext);
  const { hotelsGroups, hotelsGroupsMap, hotels, getPortfolioHotelIds } = useContext(HotelContext);
  const [removeTmpAccount, setRemoveTmpAccount] = useState(null);
  const [filters, setFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    hotelId: 1060,
  });
  const { salesManagers, listSalesManagers, removeAccount, editSalesManager } = useSalesManager();
  const [showAdd, setShowAdd] = useState(false);
  const { onRequestTableData, tableData: resultData } = useTableData();

  const [state, setState] = useState({
    page: 1,
    pagesCount: 1,
    data: [],
  });

  const handleChangePortfolio = (name, value) => {
    selectPortfolio(value);
    listSalesManagers({
      params: {
        hotelId: getPortfolioHotelIds(value),
      },
    });
  };

  const handleApplyFitlers = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (salesManagers && salesManagers.data.length) {
      if (salesManagers.type && salesManagers.type == 'remove') {
        setState({
          ...state,
          data: state.data.filter((q) => q.id !== salesManagers.data[0].id),
        });
      } else {
        setState({
          ...state,
          data: salesManagers.data.map((a) => ({
            ...a,
            address: `${a.address1 ? a.address1 : ''} ${a.address2 ? `,${a.address2}` : ''} ${
              a.city ? `,${a.city}` : ''
            } ${a.state ? `,${a.state}` : ''}`,
          })),
        });
      }
    }
  }, [salesManagers]);

  const items = useMemo(() => {
    let { data } = state;
    const { firstName } = filters;

    const newItems = data.filter((item) => {
      if (firstName.length > 0) {
        let found = false;

        if (search(String(item.firstName), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.lastName), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.phone), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.address1), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.address2), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.city), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.state), firstName) !== -1) {
          found = true;
        }

        if (search(String(item.email), firstName) !== -1) {
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

  useEffect(() => {
    if (Number(hotelId) > 0) {
      listSalesManagers({
        params: {
          hotelId: hotelId,
        },
      });
    } else if (hotels.length > 0) {
      hotels[0].id && hotels[0].id > 0 && !isNaN(hotels[0].id) ? setState(state) : setState(true);
      selectHotelId(hotels[0].id);
    }
  }, [hotelId, listSalesManagers, hotels, selectHotelId]);

  const handleClickEdit = (account) => {
    logger.log('Edit Account:', { account });
    history.push(strReplace(`${appPages.keys['sales-manager-edit'].url}`, { id: account.id }));
  };

  const handleClickRemove = (account) => {
    logger.log('Ask for permission to remove Account:', { account });
    setRemoveTmpAccount(account);
  };

  const handleRemove = async () => {
    logger.log('Remove Account:', { account: removeTmpAccount });
    removeAccount({ id: removeTmpAccount.id });
    setRemoveTmpAccount(null);
  };

  const handleDownloadAs = ({ value }) => {
    const hotelName = hotelsMap && hotelsMap[hotelId] ? hotelsMap[hotelId].hotelName : 'uknown-hotel-name';
    if (salesManagers?.data && Array.isArray(resultData) && resultData?.length) {
      exportToXLSX(
        resultData,
        buildDownloadableFilename({
          hotelName: hotelName,
          reportName: DownloadableReportNames.salesManagement,
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          rightAligned: true,
        },
      );
    }
  };

  const handleAdd = (q = null) => {
    if (q) {
      if (q.type === 'create') {
        setState({
          ...state,
          data: [...state.data, q.data],
        });
      } else {
        setState({
          ...state,
          data: state.data.map((w) => (w.id === q.data.id ? q : w)),
        });
      }
    }
    setShowAdd(false);
  };

  return showAdd ? (
    <SalesManagerAddEdit handleAddEdit={(e) => handleAdd(e)} hotelId={hotelId} />
  ) : (
    <Fragment>
      <ToolBar>
        <ToolBarItem width='450px'>
          <Search
            label='Search'
            value={filters?.firstName}
            name='firstName'
            onChange={(name, value, e) => {
              handleApplyFitlers({
                ...filters,
                firstName: value,
              });
            }}
            dataEl='searchInput'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Toggle
            value={2}
            onChange={(item) => {
              if (item === 1) {
                history.push(appPages.keys['account-mapping'].url);
              } else if (item === 0) history.push(appPages.keys['account-management'].url);
            }}
            dataEl='toggleSalesManagers'
          >
            <div data-el='buttonMapping'>{getText('Accounts')}</div>
            <div data-el='buttonAccounts'>{getText('Mapping')}</div>
            <div data-el='buttonMapping'>{getText('Sales Management')}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <SalesManagerRemove
            accountName={removeTmpAccount?.firstName}
            open={!!removeTmpAccount}
            onRemove={handleRemove}
            onCancel={() => {
              setRemoveTmpAccount(null);
            }}
          />
          <IfPermitted page='sales-managers' permissionType='create'>
            <Button
              iconName='Add'
              variant='tertiary'
              title={getText('generic.add')}
              alt='buttonCreateKpi'
              onClick={() => {
                setShowAdd(true);
              }}
              dataEl='buttonAdd'
            />
          </IfPermitted>
        </ToolBarItem>
        {/* <ToolBarItem>
        <IfPermitted page='sales-managers' permissionType='import'>
          <Button
            iconName='CloudUpload'
            variant='tertiary'
            title={getText('generic.import')}
            alt='buttonCreateKpi'
            onClick={() => {
              history.push(appPages.keys['account-management-import'].url);
            }}
            dataE='buttonUpload'
          />
          </IfPermitted>
        </ToolBarItem> */}
        <ToolBarItem>
          <IfPermitted page='sales-managers' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleDownloadAs}
              disabled={loadingList}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      {loadingList && <DataLoading />}
      {!loadingList && salesManagers.errors.length === 0 && items.length > 0 && (
        <Fragment>
          <PaginatedDataTable
            hasStripes={false}
            expandCollapePlacement={-1}
            subHeaders={columnsConfig({ onEdit: handleClickEdit, onRemove: handleClickRemove })}
            items={items}
            stickyHeaders={true}
            onRequestTableData={(value) => {
              value.forEach((v, i) => {
                Object.keys(v).forEach((q) => {
                  if (!q) {
                    delete v[q];
                  }
                });
                v['Address'] = items[i]['address'];
              });
              onRequestTableData(value);
            }}
            filtersActive={!!filters?.firstName}
            search={filters?.firstName ?? ''}
          />
          {!loadingList && salesManagers.data.length == 0 && <DisplayNoData />}
        </Fragment>
      )}
    </Fragment>
  );
});

SalesManagers.displayName = 'SalesManagers';

export { SalesManagers };
