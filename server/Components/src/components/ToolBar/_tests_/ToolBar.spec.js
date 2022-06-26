import React from 'react';
import { ToolBar, ToolBarItem } from '../index';

const TestToolBar = () => (
  <ToolBar id='toolbar'>
    <ToolBarItem>1</ToolBarItem>
    <ToolBarItem>2</ToolBarItem>
    <ToolBarItem toTheRight={true}>3</ToolBarItem>
  </ToolBar>
);

describe('ToolBar', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Should render without errors', () => {
    render(<TestToolBar />);
    expect(document.querySelector('#toolbar')).toBeDefined();
  });

  it('Should render 3 toolbar items', () => {
    render(<TestToolBar />);
    expect(document.querySelector('#toolbar').childElementCount).toEqual(3);
  });

  it('Should have "3" in the third toolbar item', () => {
    render(<TestToolBar />);
    expect(document.querySelector('#toolbar').children[2].firstChild.textContent).toEqual('3');
  });
});
