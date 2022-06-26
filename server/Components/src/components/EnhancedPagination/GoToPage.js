import React from 'react';

import { InputField } from '../FormElements/InputField';
import { LinkActions } from '../LinkActions';
import { buttonSearchPage } from './constants';

export const GoToPage = (props) => {
  const { value, onChange, fontSize, fontWeight, color, iconColor, onSubmitPage } = props || {};
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ paddingRight: '8px', fontSize: fontSize, fontWeight: fontWeight, color: color }}>Go to</div>
      <InputField
        dataEl='goToPage'
        name='goToPage'
        variant='standard'
        fontSize={fontSize}
        inputProps={{ style: { textAlign: 'center' }, 'data-testid': 'goToPage' }}
        style={{ width: 50 }}
        value={value}
        onChange={onChange}
        onEnter={() => onSubmitPage('goToPage', value)}
      />
      <LinkActions
        noPadding
        items={[buttonSearchPage(iconColor)]}
        onClick={() => {
          onSubmitPage('goToPage', value);
        }}
      />
    </div>
  );
};
