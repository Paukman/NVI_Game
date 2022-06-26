import React from 'react';
import { DragDrop } from '../DragDrop';
import { ChartCard } from '../../ChartCard';
import { StyledOuterWrapper } from '../styled';
import { range } from 'lodash';

const items = range(0, 10).map((item) => ({
  wrapper: ChartCard,
  width: 5.9,
  height: 2,
  component: <div>Test Component</div>,
}));

const DragDropTest = (props) => {
  return <DragDrop {...props} />;
};

describe('DragDrop testing', () => {
  beforeEach(() => {
    cleanup();
  });

  it('Check DragDrop renders content', () => {
    const { container } = render(<DragDropTest outerWrapper={StyledOuterWrapper} items={items} />);
    expect(container.firstChild.firstChild.childElementCount).toEqual(10);
  });

  it('Check Change Compaction Type Button when the component has hasCompaction prop', () => {
    const { container } = render(<DragDropTest outerWrapper={StyledOuterWrapper} items={items} hasCompaction />);
    const selectComponent = container.querySelector('button');
    expect(selectComponent).not.toBeNull();
  });

  it('Check Static Checkbox is available', () => {
    const { container } = render(<DragDropTest outerWrapper={StyledOuterWrapper} items={items} hasStaticCheckBox />);
    const selectComponent = container.querySelector('input');
    expect(selectComponent).not.toBeNull();
  });
});
