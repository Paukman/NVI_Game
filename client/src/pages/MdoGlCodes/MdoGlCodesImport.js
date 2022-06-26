import React, { memo, Fragment, useCallback, useContext, useEffect, useState, useRef, createRef } from 'react';
//import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import {
  Grid,
  GridItem,
  ToolBar,
  ToolBarItem,
  InputField,
  Button,
  FormState,
  Typography,
  buildHierarchy,
  ButtonCsvUpload
} from 'mdo-react-components';

import {
  KpiAggregatorButtonDropdown,
  KpiOperandButtonDropdown,
  FormContainer,
  Form,
  DisplayApiErrors,
  SuccessMessage,
  MdoGlCodeButtonSideBar,
  KpiButtonSideBar,
  ButtonsCancelSave,
  DictionaryDropdown,
  DataContainer,
} from 'components';
import { getText } from '../../utils/localesHelpers';
import { HmgGlCodeProvider } from '../../providers';

import { AppContext } from '../../contexts';
import { useMdoGlCodes } from '../../graphql';
import logger from '../../utils/logger';
import { pick } from 'lodash';
import { ToastContext } from '../../components/Toast';

import { CSVReader } from 'react-papaparse';

const buttonRef = createRef();

const MdoGlCodesImport = memo(() => {
  const history = useHistory();
  const { appPages, setPageProps } = useContext(AppContext);
  const { listMdoGlCodes, loading, mdoGlCodes, departmentNames } = useMdoGlCodes();
  const [orphanCodes, setOrphanCodes] = useState([]);
  const [newMdoGlCodes, setNewMdoGlCodes] = useState([]);

  const goBack = useCallback(() => {
    history.push(appPages.keys['mdo-gl-codes'].url);
  }, [history, appPages]);

  const handleOnUploadAccepted = ({ data, errors }) => {
    if (Array.isArray(data)) {
      const columns = data.shift();
      const tpl = columns.reduce((acc, column, idx) => {
        acc[idx] = column;
        return acc;
      }, {});

      const tmpMdoGlCodes = [];
      data.forEach((row) => {
        const rowData = row.reduce((acc, columnData, idx) => {
          acc[tpl[idx]] = columnData;
          return acc;
        }, {});

        if (rowData.id) {
          tmpMdoGlCodes.push(rowData);
        }
      });

      const [tree, orphans] = buildHierarchy(tmpMdoGlCodes, 'id', 'parentId', 'children');

      setOrphanCodes(orphans);
      setNewMdoGlCodes(tmpMdoGlCodes);
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    // TODO:
  };

  // TODO: Implement importing of MDO GL Codes here

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            variant='tertiary'
            onClick={() => {
              goBack();
            }}
            dataEl='buttonClose'
          />
        </ToolBarItem>
      </ToolBar>
      <Fragment>
        <div>
          <Typography variant='p'>Please select a CSV file with MDO GL Codes</Typography>
        </div>
        <ButtonCsvUpload
          buttonText='Upload'
          displayInput={false}
          buttonVariant='success'
          displayIcon
          onUploadAccepted={handleOnUploadAccepted}
        />
        {orphanCodes.length > 0 && (
          <Fragment>
            <p>The following codes have no parents. Please fix the issue and re-upload the file:</p>
            <ul>
              {orphanCodes.map((orphan) => {
                return (
                  <li key={orphan.id}>
                    {orphan.id} - {orphan.displayName} refers to
                    <span style={{ color: 'red' }}>{orphan.parentId}</span>
                  </li>
                );
              })}
            </ul>
          </Fragment>
        )}
        {newMdoGlCodes.length > 0 && orphanCodes.length == 0 && (
          <Fragment>
            <p>
              You are about to import the following {newMdoGlCodes.length} codes. Note that existing codes will
              be replaced by new ones:
            </p>
            <DataContainer>
              <ul>
                {newMdoGlCodes.map((orphan) => {
                  return (
                    <li key={orphan.id}>
                      {orphan.id} - {orphan.displayName} refers to {orphan.parentId}
                    </li>
                  );
                })}
              </ul>
            </DataContainer>
          </Fragment>
        )}
      </Fragment>
    </Fragment>
  );
});

MdoGlCodesImport.displayName = 'MdoGlCodesImport';

export { MdoGlCodesImport };
