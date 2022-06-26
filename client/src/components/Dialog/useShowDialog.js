import React, { useCallback, useState } from 'react';
import { ButtonsGroup, Button } from 'mdo-react-components';
import useIsMounted from '../../hooks/useIsMounted';

const useShowDialog = () => {
  const [dialogState, setDialogState] = useState({
    onClose: () => null,
    open: false,
    title: null,
    buttons: null,
    description: null,
    onHandleButtons: () => {},
    buttonsPlacement: 'right',
    buttonsSize: 'default',
    content: null,
  });

  const isMounted = useIsMounted();

  const defaultTexts = {
    1: ['Ok'],
    2: ['Cancel', 'Ok'],
  };
  const defaultVariants = {
    1: ['success'],
    2: ['default', 'success'],
  };

  const showDialog = useCallback(
    ({
      onClose = () => null,
      title = null,
      description = null,
      // this can handle all buttons at once
      onHandleButtons = () => {},
      buttonsPlacement = 'right',
      buttonsSize = 'default',
      buttons = null,
      content = null,
    }) => {
      if (isMounted()) {
        let items = null;
        if (Array.isArray(buttons) && buttons.length) {
          items = buttons.map((button, index) => {
            return (
              <Button
                key={index}
                clickId={button.clickId ?? `click${index}`}
                text={button.text ?? (defaultTexts[buttons.length]?.[index] || `Button${index}`)}
                variant={button.variant ?? (defaultVariants[buttons.length]?.[index] || 'default')}
                onClick={button.onClick ?? onHandleButtons}
                size={button.size ?? 'default'}
              />
            );
          });
        }

        setDialogState({
          open: true,
          onClose,
          title,
          buttons: items,
          description,
          buttonsPlacement,
          buttonsSize,
          content,
        });
      }
    },
    [isMounted],
  );

  const hideDialog = (_, reason) => {
    if (isMounted()) {
      setDialogState((state) => {
        return {
          ...state,
          open: false,
        };
      });
    }
  };

  return {
    showDialog,
    hideDialog,
    dialogState,
  };
};

export default useShowDialog;
