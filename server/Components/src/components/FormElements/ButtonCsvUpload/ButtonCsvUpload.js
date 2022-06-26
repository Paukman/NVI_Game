import React, { memo, useRef, useEffect } from 'react';
import { useCSVReader } from 'react-papaparse';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon';
import { Typography } from '../../Typography';
import { Zone, PlaceHolderText, File, FileName } from './styled';

const ButtonCsvUpload = memo((props) => {
  const { CSVReader } = useCSVReader();
  const { onUploadAccepted, error, onRemoveFile } = props;

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        onUploadAccepted(results);
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => {
        return (
          <>
            <Typography paragraph>FILE UPLOADER</Typography>
            <Zone {...getRootProps()}>
              {acceptedFile ? (
                <>
                  <File>
                    <div>
                      <FileName error={error}>
                        <Icon name='AttachFile' size='20' />
                        <span>{acceptedFile.name}</span>
                      </FileName>
                      <div>
                        <ProgressBar />
                      </div>
                    </div>
                    <div {...getRemoveFileProps()}>
                      <div onClick={onRemoveFile}>
                        <Icon name='Close' size='20' />
                      </div>
                    </div>
                  </File>
                </>
              ) : (
                <PlaceHolderText>
                  <Icon name='AttachFile' size='20' />
                  Upload or Drop file here
                </PlaceHolderText>
              )}
            </Zone>
          </>
        );
      }}
    </CSVReader>
  );
});

ButtonCsvUpload.displayName = 'ButtonCsvUpload';

ButtonCsvUpload.propTypes = {
  onUploadAccepted: PropTypes.func,
  onRemoveFile: PropTypes.func,
  error: PropTypes.bool,
};

ButtonCsvUpload.defaultProps = {
  error: false,
};

export { ButtonCsvUpload };
