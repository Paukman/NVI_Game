import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Globalstyle } from './styled';
import { Button } from '../FormElements/Button';
import { Checkbox } from '../FormElements/Checkbox';
import { range, toNumber } from 'lodash';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const DragDrop = (props) => {
  const { countOfColumns, isDraggable, items, hasCompaction, outerWrapper, hasStaticCheckBox } = props;
  const [state, setState] = useState({
    currentBreakpoint: 'lg',
    compactType: 'vertical',
  });
  const OutterWrapper = outerWrapper;
  const [layoutsOfItem, setLayoutsOfItem] = useState({ lg: null });
  const [active, setActive] = useState({});

  useEffect(() => {
    const generateLayout = () => {
      let x = 0;
      let y = 0;
      const columns = (items.length / countOfColumns).toFixed(0);
      return items.map((item, index) => {
        if (index >= columns && index % columns === 0) {
          x += item.width;
        }

        if (index % columns !== 0) {
          y += item.height;
        } else {
          y = 0;
        }

        return {
          x,
          y,
          w: item.width,
          h: item.height,
          i: index.toString(),
          minH: item.minHeight,
          maxH: item.maxHeight,
          static: active[index] === true,
        };
      });
    };
    setLayoutsOfItem({ ...layoutsOfItem, lg: generateLayout() });
  }, [active, setLayoutsOfItem]);

  const checkChange = (event) => {
    setActive({
      ...active,
      [event.target.id]: event.target.checked,
    });
  };

  const generateDOM = () => {
    return items.map((item, index) => {
      const chkId = `${index}`;
      const Wrapper = item.wrapper;
      return (
        <div data-el={`element-${index}`} key={index}>
          <Wrapper data-el='inner-wrapper'>
            {item.component}
            {hasStaticCheckBox && (
              <Checkbox
                data-el={`checkbox-${index}`}
                label='Static'
                key={index}
                id={chkId}
                checked={active[chkId] === true}
                onChange={checkChange}
              />
            )}
          </Wrapper>
        </div>
      );
    });
  };

  const onResize = (layout, oldLayoutItem, layoutItem, placeholder) => {
    const initialWidth = Math.min(...items.map((item) => item.width));
    let tempWidth = initialWidth;
    const scale = range(1, countOfColumns + 1);
    scale.map((item) => {
      if (initialWidth * (item + 1) > layoutItem.w && layoutItem.w >= initialWidth * item) {
        tempWidth = initialWidth * item;
      }
    });
    if (tempWidth > initialWidth * scale.length) {
      layoutItem.w = toNumber(initialWidth * scale.length);
    }
    if (initialWidth > layoutItem.w) {
      layoutItem.w = toNumber(initialWidth).toFixed(0);
    }
    layoutItem.w = toNumber(tempWidth);
  };

  const onBreakpointChange = (breakpoint) => {
    setState({
      ...state,
      currentBreakpoint: breakpoint,
    });
  };

  const onCompactTypeChange = () => {
    const { compactType: oldCompactType } = state;
    const compactType =
      oldCompactType === 'horizontal' ? 'vertical' : oldCompactType === 'vertical' ? null : 'horizontal';
    setState({ ...state, compactType });
  };

  return (
    <OutterWrapper data-el='outer-wrapper'>
      <Globalstyle />
      {hasCompaction && <Button data-el='button-compact' onClick={onCompactTypeChange} text='Change Compaction Type' />}
      <ResponsiveReactGridLayout
        {...props}
        layouts={layoutsOfItem}
        onBreakpointChange={onBreakpointChange}
        // WidthProvider option
        measureBeforeMount={true}
        onResize={onResize}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        //useCSSTransforms={mount}
        isDraggable={isDraggable}
        compactType={state?.compactType}
        preventCollision={!state?.compactType}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </OutterWrapper>
  );
};

DragDrop.displayName = 'DragDrop';

DragDrop.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})),
  countOfColumns: PropTypes.number,
  itemWrapper: PropTypes.any,
  outerWrapper: PropTypes.any,
  hasCompaction: PropTypes.bool,
  hasStaticCheckBox: PropTypes.bool,
  isDraggable: PropTypes.bool,
};

DragDrop.defaultProps = {
  items: [],
  countOfColumns: 1,
  itemWrapper: 'div',
  outerWrapper: 'div',
  hasCompaction: false,
  hasStaticCheckBox: false,
  isDraggable: false,
};

export { DragDrop };
