import React, { memo, useEffect, useState, useCallback, useContext, Fragment, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  RecursiveDataTable,
  buildHierarchy,
  ToolBar,
  ToolBarItem,
  Button,
  ButtonDownloadAs,
  RemoveConfirmationDialog,
  LinkActions,
} from 'mdo-react-components';

import { useMdoGlCodes } from '../../graphql';
import { DataContainer, DataLoading, DisplayNoData, IfPermitted } from 'components';

import { exportToXLSX, buildDownloadableFilename, findDepth } from 'utils/downloadHelpers';
import { getText } from 'utils/localesHelpers';
import logger from 'utils/logger';
import { strReplace } from 'utils/formatHelpers';
import { formatDateForDownloading } from 'utils/dataManipulation';
import { AppContext, UserContext } from 'contexts';

import { appSettings } from 'config/appSettings';
import { DownloadableReportNames } from 'config/downlodableReportNames';
import { updateTreeWithDepartmentNames, columnNamesMapping } from './utils';
import { USER_ROLES } from 'config/constants';
import { useTableData } from 'hooks';

const MdoGlCodes = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const { listMdoGlCodes, loading, mdoGlCodes, departmentNames } = useMdoGlCodes();
  const [data, setData] = useState([]);
  const [removeMdoGlCode, setRemoveMdoGlCode] = useState(null);

  const { onRequestTableData, tableData } = useTableData();

  useEffect(() => {
    listMdoGlCodes();
  }, [listMdoGlCodes]);

  useEffect(() => {
    const [tree, orphans] = buildHierarchy(mdoGlCodes, 'id', 'parentId', 'children');
    const updatedTree = updateTreeWithDepartmentNames(tree, departmentNames);
    if (!appSettings.isProduction && orphans.length > 0) {
      logger.warn(`There are ${orphans.length} orphans in the data to display in HMG GL Codes hierarchy`, orphans);
    }

    setData([{ children: updatedTree }]);
  }, [mdoGlCodes, departmentNames, buildHierarchy]);

  const handleClickCreate = () => {
    logger.debug('Create a MDO GL Code');
    history.push(appPages.keys['mdo-gl-codes-add'].url);
  };

  const handleClickImport = () => {
    logger.debug('Import MDO GL Codes');
    history.push(appPages.keys['mdo-gl-codes-import'].url);
  };

  const handleAction = (button, mdoGlCode) => {
    logger.debug('Action', button, mdoGlCode);
    switch (button.clickId) {
      case 'edit':
        history.push(strReplace(`${appPages.keys['mdo-gl-codes-edit'].url}`, { id: mdoGlCode.id }));
        break;

      case 'remove':
        setRemoveMdoGlCode(mdoGlCode);
        break;
    }
  };

  const handleClickDownload = useCallback(
    ({ value }) => {
      const clearedData = tableData.map((item) => _.omit(item, ''));
      logger.debug('Download button clicked:', value, clearedData);
      let indents = [];
      findDepth(data[0]?.children, indents);
      const reportName = DownloadableReportNames.mdoGlCodes;
      exportToXLSX(
        clearedData,
        buildDownloadableFilename({
          reportName,
          date: formatDateForDownloading(),
        }),
        value == 'excel' ? 'xlsx' : value,
        '',
        {
          isHeader: false,
          style: true,
          noTotalStyle: true,
          indents,
          overrideLeftAlignBodyData: true,
          reportName,
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
    },
    [mdoGlCodes, tableData],
  );

  const handleMdoGlCodeRemove = () => {
    logger.debug('Removing MDO GL Code', removeMdoGlCode);
    setRemoveMdoGlCode(null);
  };

  return (
    <Fragment>
      <ToolBar>
        {user?.roleId === USER_ROLES.SUPER_ADMIN && (
          <ToolBarItem toTheRight>
            <IfPermitted page='mdo-gl-codes' permissionType='create'>
              <Button
                variant='tertiary'
                iconName='Add'
                title={getText('generic.add')}
                onClick={handleClickCreate}
                disabled={loading}
                dataEl='buttonAdd'
              />
            </IfPermitted>
          </ToolBarItem>
        )}
        <ToolBarItem toTheRight={user?.roleId !== USER_ROLES.SUPER_ADMIN}>
          <IfPermitted page='mdo-gl-codes' permissionType='import'>
            <Button
              iconName='CloudUploadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.import')}
              onClick={handleClickImport}
              disabled={loading}
              dataEl='buttonImport'
            />
          </IfPermitted>
        </ToolBarItem>
        <ToolBarItem>
          <IfPermitted page='mdo-gl-codes' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              variant='tertiary'
              text=''
              title={getText('generic.download')}
              exclude={['pdf']}
              onClick={handleClickDownload}
              disabled={loading}
              dataEl={'buttonDownloadAs'}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      <RemoveConfirmationDialog
        open={!!removeMdoGlCode}
        title={getText('mdoGlCodes.removeTitle')}
        description={strReplace(getText('mdoGlCodes.removeText'), { mdoGlCode: removeMdoGlCode?.id })}
        deleteText={getText('generic.remove')}
        cancelText={getText('generic.cancel')}
        onConfirm={handleMdoGlCodeRemove}
        onCancel={() => {
          setRemoveMdoGlCode(null);
        }}
        onClose={() => setRemoveMdoGlCode(null)}
      />
      {loading && <DataLoading />}
      {!loading && data.length === 0 && <DisplayNoData />}
      {!loading && (
        <DataContainer>
          <RecursiveDataTable
            subHeaders={[
              { field: 'id', headerName: 'MDO GL Code', width: 200, align: 'left', headerAlign: 'center' },
              { field: 'displayName', headerName: 'Description', width: 'auto' },
              { field: 'department', headerName: 'Department', width: 400 },
              {
                field: '',
                headerName: '',
                width: 120,
                // eslint-disable-next-line
                onRender: (args) => {
                  // eslint-disable-next-line
                  const { dataRow } = args;
                  return (
                    <IfPermitted page='mdo-gl-codes' permissionType='edit'>
                      <LinkActions
                        items={[
                          {
                            clickId: 'edit',
                            text: getText('generic.edit'),
                            variant: 'tertiary',
                          },
                          {
                            clickId: 'remove',
                            text: getText('generic.remove'),
                            variant: 'tertiary',
                          },
                        ]}
                        onClick={(button) => handleAction(button, dataRow)}
                      />
                    </IfPermitted>
                  );
                },
              },
            ]}
            data={data}
            pageSize={2000}
            stickyHeaders={true}
            onRequestTableData={onRequestTableData}
            columnNamesMapping={columnNamesMapping}
          />
        </DataContainer>
      )}
    </Fragment>
  );
});

MdoGlCodes.displayName = 'MdoGlCodes';

export { MdoGlCodes };
