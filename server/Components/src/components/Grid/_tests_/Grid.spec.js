import React from 'react';
import Grid from '../Grid';
import GridItem from '../GridItem';

const GridTest = (props) => {
  return (
    <Grid>
      <GridItem>1</GridItem>
      <GridItem>2</GridItem>
      <GridItem>3</GridItem>
    </Grid>
  );
};

describe('Grid & GridItem', () => {
  beforeEach(() => {
    cleanup();
  });

  /**
   * Grid & GridItem are pure wrappers around material-ui components and they were already tested by creators
   * In this test we just want to make sure that our wrappers actually renders children
   */
  it('Check Grid renders childrens', () => {
    render(<GridTest />);
    expect(document.querySelector('div.MuiGrid-root').childElementCount).toEqual(3);
  });

  it('Check GridItem renders childrens', () => {
    render(<GridTest />);
    expect(document.querySelector('div.MuiGrid-root').children[0].textContent).toEqual('1');
    expect(document.querySelector('div.MuiGrid-root').children[1].textContent).toEqual('2');
    expect(document.querySelector('div.MuiGrid-root').children[2].textContent).toEqual('3');
  });
});
