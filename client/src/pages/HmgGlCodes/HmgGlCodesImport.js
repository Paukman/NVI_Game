import React, { memo } from 'react';
import { CSVLink } from 'react-csv';
import { CsvUploadContainer, UploadWrapper, CoaSelectWrapper } from './styled';
import { getText } from 'utils';
import { Button, ButtonCsvUpload, Dropdown } from 'mdo-react-components';
import { MultiSelector } from 'components';
import { STATUSES, COA_ITEMS } from './constants';

import { useHmgGlCodesImport } from './hooks/useHmgGlCodesImport';

const HmgGlCodesImport = memo(() => {
  const { state, handleCoaSelect, goBack, handleSubmit, onUploadAccepted, onRemoveFile } = useHmgGlCodesImport();

  return (
    <>
      <CsvUploadContainer>
        <UploadWrapper>
          <CSVLink filename={'hmg_gl_codes_template'} data={[['HMG GL Code', 'Display Name', 'MDO GL Code']]}>
            <Button variant='none' text={getText('generic.downloadTemplate')} />
          </CSVLink>
          <ButtonCsvUpload onUploadAccepted={(data) => onUploadAccepted(data)} onRemoveFile={onRemoveFile} error={state.csvError} />
        </UploadWrapper>
        <CoaSelectWrapper>
          <Dropdown
            items={COA_ITEMS}
            value={state.coaValue}
            name='dropdown'
            label={getText('hmgGlCodes.applyCoaTo')}
            onChange={handleCoaSelect}
          />
        </CoaSelectWrapper>
        <MultiSelector
          data={state?.data}
          selectedData={state?.selectedData}
          handleSubmit={handleSubmit}
          onCancel={() => goBack()}
          onSave={(data) => handleSubmit(data)}
          inProgress={state.status === STATUSES.SAVING}
          canSave={state.csvData.length > 0 && !state.csvError}
        />
      </CsvUploadContainer>
    </>
  );
});

HmgGlCodesImport.displayName = 'HmgGlCodesImport';

export { HmgGlCodesImport };
