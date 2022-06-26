import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { Alert, SimpleDialog } from 'mdo-react-components';

import useShowDialog from './useShowDialog';

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  DialogProvider.propTypes = {
    children: PropTypes.node,
  };
  const { showDialog, hideDialog, dialogState } = useShowDialog();

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      {!dialogState.content && (
        <Alert
          title={dialogState.title}
          open={dialogState.open}
          onClose={hideDialog}
          buttons={<>{dialogState.buttons}</>}
          description={dialogState.description}
        />
      )}
      {dialogState.content && (
        <SimpleDialog open={dialogState.open} onClose={hideDialog} maxWidth={'lg'}>
          {dialogState.content}
        </SimpleDialog>
      )}
    </DialogContext.Provider>
  );
};
