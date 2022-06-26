import { fireEvent } from '@testing-library/dom';
import React from 'react';
import { ButtonsGroup } from '../ButtonsGroup';

describe('ButtonsGroup component', () => {
  it('Renders ButtonsGroup with 2 buttons', () => {
    const props = {
      items: [
        {
          clickId: 1,
          text: 'Follow',
          iconName: 'search',
          variant: 'alert',
        },
        {
          clickId: 2,
          text: 'Timer',
          iconName: 'Timer',
          variant: 'secondary',
        },
      ],
    };
    render(<ButtonsGroup {...props} />);
    expect(document.getElementsByTagName('button').length).toEqual(2);
  });

  it('Renders ButtonsGroup with Follow button', async () => {
    const props = {
      items: [
        {
          clickId: 1,
          text: 'Follow',
          iconName: 'search',
          variant: 'alert',
        },
        {
          clickId: 2,
          text: 'Timer',
          iconName: 'Timer',
          variant: 'secondary',
        },
      ],
    };
    const { getByText } = render(<ButtonsGroup {...props} />);

    expect(getByText('Follow')).toBeInTheDocument();
  });
  it('should handle callback from items', async () => {
    const buttonClick = jest.fn();
    const props = {
      items: [
        {
          clickId: 'ok',
          text: 'OK',
          variant: 'default',
          onClick: buttonClick,
        },
      ],
    };
    const { getByText } = render(<ButtonsGroup {...props} />);

    expect(getByText('OK')).toBeInTheDocument();
    fireEvent.click(getByText('OK'));
    expect(buttonClick).toBeCalled();
  });
});
