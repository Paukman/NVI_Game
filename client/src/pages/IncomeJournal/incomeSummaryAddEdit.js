import React, { Fragment, memo, useEffect, useState, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';

import { Button, InputField, ToolBar, ToolBarItem, PageLoading } from 'mdo-react-components';

import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';

import { ErrorMessage } from '../../components/ErrorMessage';
import { MdoGlCodeSelector, StatusSelector, HotelSelector, PmsTypeSelector, HmgGlCodeSelector } from '../../components';

import { getText } from '../../utils/localesHelpers';

import { useHmgGlCodes } from '../../graphql';

import { Form, ButtonGroup, FormContainer, InputGroup } from './styled';
import { useIJeports } from '../../graphql/useIJReports';

const newHmgGlCode = {
  statusId: 0,
};

const IncomeSummaryAddEdit = memo((props) => {
  const { hotelId, date, onClose } = props;
  const { hotels, loadingList } = useContext(HotelContext);
  const { appPages, setPageProps } = useContext(AppContext);
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const history = useHistory();
  const params = useParams();
  const {
    listHmgGlCodes,
    getHmgGlCode,
    createHmgGlCode,
    updateHmgGlCode,
    hmgGlCode,
    loadingOne,
    creating,
    updating,
    lastOperationResult,
    hmgGlCodes,
  } = useHmgGlCodes();
  const { incomeJournalSummaryAdd, incomeJournalAdd, incomeJournalSummaryAddLoading } = useIJeports();
  const hmgGlCodeId = params.id;

  const goBack = () => {
    onClose('close');
  };

  useEffect(() => {
    if (incomeJournalAdd && incomeJournalAdd.data) {
      onClose('data', incomeJournalAdd.data);
    }
  }, [incomeJournalAdd]);

  const handleChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value || '',
    };

    setState(newState);
    const keys = ['description', 'pmsTypeId', 'amount', 'hmgGlCode'];
    setValid(keys.every((inp) => !!newState[inp]));
  };

  const handleSubmit = () => {
    setSaving(true);
    incomeJournalSummaryAdd({
      hotelId: hotelId,
      date: date,
      hmgGlCode: state.hmgGlCode || '',
      description: state.description || '',
      amount: Number(state.amount),
      amountAdjustment: Number(state.amountAdjustment),
      pmsTypeId: state.pmsTypeId || '',
    });

    // if (state.id) {
    //   updateHmgGlCode({
    //     id: hmgGlCode.id,
    //     params: {
    //       hotelId: state.hotelId,
    //       hmgGlCode: state.hmgGlCode,
    //       displayName: state.displayName,
    //       mdoGlCode: state.mdoGlCode,
    //       statusId: state.statusId,
    //     },
    //   });
    // } else {
    //   createHmgGlCode({
    //     params: {
    //       hotelId: state.hotelId,
    //       hmgGlCode: state.hmgGlCode || '',
    //       displayName: state.displayName || '',
    //       mdoGlCode: state.mdoGlCode || '',
    //       statusId: state.statusId,
    //     },
    //   });
    // }
  };

  if (loadingOne) {
    return <PageLoading open />;
  }

  return (
    <Fragment>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            variant='tertiary'
            onClick={() => {
              onClose('close');
            }}
            dataEl='buttonClose'
          />
        </ToolBarItem>
      </ToolBar>
      <FormContainer>
        <Form>
          <InputField
            name='description'
            value={state.description || ''}
            onChange={handleChange}
            label={getText('generic.description')}
            error={!!errors['description']}
            helperText={errors['description']}
            required
          />
          <PmsTypeSelector
            name={`pmsTypeId`}
            value={state.pmsTypeId}
            label='PMS Type'
            required
            onChange={handleChange}
            excludeItems={PmsTypeSelector.notAllowedWithAll}
          />
          <InputGroup>
            <InputField
              name='amount'
              value={state.amount || ''}
              onChange={handleChange}
              label={'Amount'}
              error={!!errors['amount']}
              helperText={errors['amount']}
              type={'number'}
              required
            />
            <InputField
              name='amountAdjustment'
              value={state.amountAdjustment || ''}
              onChange={handleChange}
              label={'Adjustment'}
              error={!!errors['adjustment']}
              helperText={errors['adjustment']}
              type={'number'}
            />
            <div>
              <p>Total:</p>
              <b>
                {state && state.amount
                  ? state.amountAdjustment
                    ? state.amount - state.amountAdjustment
                    : state.amount
                  : ''}
              </b>
            </div>
          </InputGroup>
          <HmgGlCodeSelector
            name={`hmgGlCode`}
            label='Select GL Code'
            hotelId={hotelId}
            value={state.hmgGlCode}
            required
            onChange={handleChange}
          />
        </Form>
        {errors[''] && <ErrorMessage>{errors['']}</ErrorMessage>}
        <ButtonGroup>
          <Button
            variant='default'
            iconName='Block'
            text={getText('generic.cancel')}
            onClick={() => {
              goBack();
            }}
          />
          <Button
            variant='primary'
            iconName='Check'
            text={getText('generic.save')}
            onClick={handleSubmit}
            disabled={!isValid}
            inProgress={creating || updating}
          />
        </ButtonGroup>
      </FormContainer>
    </Fragment>
  );
});

IncomeSummaryAddEdit.displayName = 'IncomeSummaryAddEdit';

IncomeSummaryAddEdit.propTypes = {
  hotelId: PropTypes.number,
  date: PropTypes.any,
  onClose: PropTypes.func,
};

export { IncomeSummaryAddEdit };
