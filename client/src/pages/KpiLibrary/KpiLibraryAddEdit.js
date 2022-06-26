import React, { memo, Fragment, useCallback, useContext, useEffect, useState, useRef } from 'react';
//import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import { Grid, GridItem, ToolBar, ToolBarItem, InputField, Button, FormState } from 'mdo-react-components';

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
} from '../../components';
import { getText } from '../../utils/localesHelpers';
import { HmgGlCodeProvider } from '../../providers';

import { AppContext } from '../../contexts';
import { useKpi } from '../../graphql/useKpi';
import logger from '../../utils/logger';
import { pick } from 'lodash';
import { ToastContext } from '../../components/Toast';

const newKpi = {
  kpiName: '',
  kpiDescription: '',
  kpiFormula: '',
  valueTypeId: 1,
};

const STATUSES = {
  INIT: 1,
  IDLE: 2,
  LOADING: 3,
  SAVING: 4,
  TESTING: 5,
  ERRORS: 6,
  SAVED: 7,
};

const FORMULA_VALUE_TYPES = {
  OPERAND: 1,
  FUNCTION: 2,
  KPI: 3,
  GL_CODE: 4,
};

const KpiLibraryAddEdit = memo(() => {
  const history = useHistory();
  const params = useParams();
  const { appPages, setPageProps } = useContext(AppContext);
  const { kpi, kpiGet, kpiCreate, kpiUpdate, kpiTestFormula, kpiLoading, kpiCreating, kpiUpdating, kpiTestingFormula } =
    useKpi();
  const { showToast } = useContext(ToastContext);
  const [state, setState] = useState(newKpi);
  const [status, setStatus] = useState(STATUSES.INIT);
  const [isFormulaCorrect, setFormulaCorrectFlag] = useState(false);
  const formulaRef = useRef();

  const validate = (formData) => {
    return !!(formData.kpiName && formData.kpiDescription && formData.kpiFormula);
  };

  const handleSubmit = useCallback((formData) => {
    const id = formData.id;
    const params = pick(formData, ['kpiName', 'kpiDescription', 'kpiFormula', 'valueTypeId']);

    logger.debug('Save KPI:', { params, formData, kpi });

    setStatus(STATUSES.SAVING);

    if (id) {
      kpiUpdate({
        id,
        params,
      });
    } else {
      kpiCreate(params);
    }
  }, []);

  const getFormulaHelperText = useCallback(() => {
    if (kpi.errorsMap['kpiFormula']) {
      return kpi.errorsMap['kpiFormula'];
    }

    return isFormulaCorrect ? getText('kpi.formulaIsCorrect') : getText('kpi.kpiFormulHint');
  }, [kpi, isFormulaCorrect]); // eslint-disable-line

  const goBack = useCallback(() => {
    history.push(appPages.keys['kpi'].url);
  }, [history, appPages]);

  useEffect(() => {
    if (params.id) {
      if (status === STATUSES.INIT) {
        logger.debug('Loading KPI by ID', params.id);
        setStatus(STATUSES.LOADING);
        kpiGet(params.id);
      }
    } else {
      setStatus(STATUSES.IDLE);
    }
  }, [params]);

  useEffect(() => {
    if (status === STATUSES.SAVING) {
      const newStatus = kpi.errors.length ? STATUSES.ERRORS : STATUSES.SAVED;
      setStatus(newStatus);

      if (newStatus === STATUSES.SAVED) {
        setTimeout(() => {
          showToast({ message: getText('kpi.savedSuccessfully').concat(' ').concat(kpi.data.kpiName) });
          goBack();
        }, 1000);
      }
    } else if (status === STATUSES.TESTING) {
      const newStatus = kpi.errors.length ? STATUSES.ERRORS : STATUSES.IDLE;
      setStatus(newStatus);

      setFormulaCorrectFlag(kpi.errors.length === 0);
    }

    logger.debug('kpi changed', kpi, kpiLoading);

    if (kpi.data) {
      logger.debug('Setting loaded KPI', kpi.data);

      if (status === STATUSES.LOADING) {
        setStatus(STATUSES.IDLE);
        setState(kpi.data);
        setPageProps({
          title: `Edit '${kpi.data.kpiName}'`,
        });
      }
    } else if (kpi.errors.length === 0 && !kpiLoading) {
      logger.debug('Setting default KPI', newKpi);
      setState(newKpi);
    }
  }, [kpi]);

  const updateFormulaUpdate = ({ data, value, handleChange, formulaValueType }) => {
    const selectionStart = formulaRef.current.selectionStart;
    const selectionEnd = formulaRef.current.selectionEnd;
    let newPart = '';
    let newPosition = selectionEnd + newPart.length;

    switch (formulaValueType) {
      default:
      case FORMULA_VALUE_TYPES.OPERAND:
        newPart = `${value} `;
        newPosition = selectionEnd + newPart.length;
        break;

      case FORMULA_VALUE_TYPES.FUNCTION:
        newPart = `${value}()`;
        newPosition = selectionEnd + newPart.length - 1;
        break;

      case FORMULA_VALUE_TYPES.KPI:
      case FORMULA_VALUE_TYPES.GL_CODE:
        newPart = `[${value}]`;
        newPosition = selectionEnd + newPart.length;
        break;
    }

    const newFormula = data.kpiFormula.slice(0, selectionStart) + newPart + data.kpiFormula.slice(selectionEnd);

    handleChange('kpiFormula', newFormula);

    setImmediate(() => {
      formulaRef.current.focus();
      formulaRef.current.setSelectionRange(newPosition, newPosition);
    });
  };

  const inProgress = kpiLoading || kpiCreating || kpiUpdating;

  return (
    <HmgGlCodeProvider>
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
        <FormState
          data={state}
          onSubmit={handleSubmit}
          onChange={({ name }) => {
            if (name === 'kpiFormula') {
              setFormulaCorrectFlag(false);
            }
          }}
        >
          {({ data, handleChange, submit }) => {
            return (
              <FormContainer>
                <Form>
                  <Grid spacing={3}>
                    <GridItem xs={12}>
                      <DictionaryDropdown
                        required
                        name='kpiDataTypeId'
                        label={getText('kpi.kpiDataTypeId')}
                        onChange={handleChange}
                        value={data.kpiDataTypeId}
                        error={!!kpi.errorsMap['kpiDataTypeId']}
                        helperText={kpi.errorsMap['kpiDataTypeId']}
                        dictionaryType='kpi-data-type'
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        required
                        name='kpiName'
                        label={getText('kpi.kpiName')}
                        onChange={handleChange}
                        value={data.kpiName}
                        error={!!kpi.errorsMap['kpiName']}
                        helperText={kpi.errorsMap['kpiName']}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        required
                        name='kpiDescription'
                        label={getText('kpi.kpiDescription')}
                        onChange={handleChange}
                        value={data.kpiDescription}
                        error={!!kpi.errorsMap['kpiDescription']}
                        helperText={kpi.errorsMap['kpiDescription']}
                        multiline
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <ToolBar>
                        <ToolBarItem toTheRight>
                          <MdoGlCodeButtonSideBar
                            text={getText('kpi.addGlCode')}
                            iconName='Add'
                            variant='tertiary'
                            onChange={(name, value) => {
                              updateFormulaUpdate({
                                data,
                                value: value.id,
                                handleChange,
                                formulaValueType: FORMULA_VALUE_TYPES.GL_CODE,
                              });
                            }}
                            dataEl='buttonAddGlCode'
                          />
                        </ToolBarItem>
                        <ToolBarItem>
                          <KpiButtonSideBar
                            text={getText('kpi.addKpi')}
                            iconName='Add'
                            variant='tertiary'
                            onChange={(name, value) => {
                              updateFormulaUpdate({
                                data,
                                value: value.id,
                                handleChange,
                                formulaValueType: FORMULA_VALUE_TYPES.KPI,
                              });
                            }}
                            dataEl='buttonAddKpi'
                          />
                        </ToolBarItem>
                        <ToolBarItem>
                          <KpiOperandButtonDropdown
                            text={getText('kpi.addOperator')}
                            iconName='Add'
                            variant='tertiary'
                            onClick={(value) => {
                              updateFormulaUpdate({
                                data,
                                value: value.value,
                                handleChange,
                                formulaValueType: FORMULA_VALUE_TYPES.OPERAND,
                              });
                            }}
                            dataEl='buttonAddOperator'
                          />
                        </ToolBarItem>
                        <ToolBarItem>
                          <KpiAggregatorButtonDropdown
                            text={getText('kpi.addFunction')}
                            iconName='Add'
                            variant='tertiary'
                            onClick={(value) => {
                              updateFormulaUpdate({
                                data,
                                value: value.value.toUpperCase(),
                                handleChange,
                                formulaValueType: FORMULA_VALUE_TYPES.FUNCTION,
                              });
                            }}
                            dataEl='buttonAddFunction'
                          />
                        </ToolBarItem>
                        <ToolBarItem>
                          <Button
                            text='Test'
                            variant='default'
                            disabled={!data.kpiFormula || kpiTestingFormula}
                            onClick={() => {
                              setStatus(STATUSES.TESTING);
                              kpiTestFormula({
                                kpiFormula: data.kpiFormula,
                              });
                            }}
                          />
                        </ToolBarItem>
                      </ToolBar>
                    </GridItem>
                    <GridItem xs={12}>
                      <InputField
                        required
                        ref={formulaRef}
                        name='kpiFormula'
                        label={getText('kpi.kpiFormula')}
                        onChange={handleChange}
                        value={data.kpiFormula}
                        error={!!kpi.errorsMap['kpiFormula']}
                        helperText={getFormulaHelperText()}
                        multiline
                      />
                    </GridItem>
                    {kpi.errors.length > 0 && (
                      <GridItem xs={12}>
                        <DisplayApiErrors errors={kpi.errors} genericOnlyErrors />
                      </GridItem>
                    )}
                    <GridItem xs={12}>
                      <ButtonsCancelSave
                        inProgress={inProgress}
                        canSave={validate(data)}
                        onCancel={() => goBack()}
                        onSave={() => submit()}
                      />
                    </GridItem>
                  </Grid>
                </Form>
              </FormContainer>
            );
          }}
        </FormState>
      </Fragment>
    </HmgGlCodeProvider>
  );
});

KpiLibraryAddEdit.displayName = 'KpiLibraryAddEdit';

export { KpiLibraryAddEdit };
