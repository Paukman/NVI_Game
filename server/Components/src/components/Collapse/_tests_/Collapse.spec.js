import React from 'react';
import { Collapse } from '../Collapse';

const TextToCheck = 'HERE WE HAVE CONTENT.';

const CollapseTest = (props) => {
  return <Collapse {...props}>{TextToCheck}</Collapse>;
};

describe('Collapse testing', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Check Collapse renders closed', () => {
    render(<CollapseTest open={false} />);
    expect(document.querySelector('div.MuiCollapse-container.MuiCollapse-hidden')).toBeDefined();
  });

  it('Check Collapse renders opened', () => {
    render(<CollapseTest open />);
    expect(document.querySelector('div.MuiCollapse-containerMuiCollapse-entered')).toBeDefined();
  });

  // it('Check Collapse renders children', () => {
  //   render(<CollapseTest open />);
  //   expect(document.querySelector('div.MuiCollapse-container').textContent).toEqual(TextToCheck);
  // });
});
