import React, { memo, useContext } from 'react';

import {
  ToolBar,
  ToolBarItem,
  Toggle,
  InputDate,
  Button,
  RecursiveDataTable,
  ButtonDownloadAs,
} from 'mdo-react-components';
import {
  HotelSelector,
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  DataContainer,
  StrDisclaimer,
  IfPermitted,
} from 'components';

import { getText } from 'utils/localesHelpers';
import { isDateValid } from 'utils/validators';
import { StrContext } from 'providers';
import { mode } from './constants';

const StrDefaultReportPage = memo(() => {
  const { defaultStr } = useContext(StrContext);
  const { state, onChange, listStrReport, onHandleDownload } = defaultStr;

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector name='hotelId' value={state?.hotelId} onChange={onChange} disableClearable={true} />
        </ToolBarItem>
        <ToolBarItem>
          <InputDate
            dataEl='inputDate'
            label={getText('generic.date')}
            name='date'
            value={state?.date}
            onChange={onChange}
          />
        </ToolBarItem>
        <ToolBarItem>
          <Button
            iconName={state?.requestReport ? '' : 'Refresh'}
            text={state?.requestReport ? getText('generic.go') : ''}
            title={getText(`generic.${state?.requestReport ? 'refresh' : 'go'}`)}
            variant='secondary'
            onClick={() => listStrReport()}
            disabled={!isDateValid(state.date)}
            dataEl='buttonGo'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Toggle
            value={state?.mode}
            onChange={(value) => {
              onChange('mode', value);
            }}
            dataEl='toggleSTRDefaultReport'
          >
            <div>{getText('strReports.fourWeek')}</div>
            <div>{getText('strReports.fiftyTwoWeek')}</div>
          </Toggle>
        </ToolBarItem>
      </ToolBar>
      <ToolBar>
        <ToolBarItem toTheRight>
          <IfPermitted page='str-default' permissionType='download'>
            <ButtonDownloadAs
              iconName='CloudDownloadSharp'
              text=''
              variant='tertiary'
              onClick={onHandleDownload}
              exclude={['pdf']}
              dataEl={'buttonDownloadAs'}
              disabled={state.listingData?.length ? false : true}
            />
          </IfPermitted>
        </ToolBarItem>
      </ToolBar>
      {state.listingData?.length ? (
        <>
          <DataContainer obsoleteData={state?.requestReport}>
            <RecursiveDataTable
              expandCollapePlacement={-1}
              data={[{ children: state?.listingData }]}
              subHeaders={state?.subHeaders}
              headers={
                state?.mode === mode.fourWeeks
                  ? [state?.headers?.fourWeeksHeader]
                  : [state?.headers?.fiftyTwoWeeksHeader]
              }
              freezeColumns={0}
              stickyHeaders={true}
            />
          </DataContainer>
          <StrDisclaimer />
        </>
      ) : (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.MESSAGE && <DisplayNoData message={state?.pageState.MESSAGE} />}
        </>
      )}
    </>
  );
});

StrDefaultReportPage.displayName = 'StrDefaultReport';

export { StrDefaultReportPage };
