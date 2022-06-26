import React, { memo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BaseListItem } from './BaseListItem';
import { colors } from '../../theme/colors';
import PropTypes from 'prop-types';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex, alwaysTopIndex) => {
  const result = Array.from(list);
  if (endIndex > alwaysTopIndex - 1) {
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  }
  return result;
};

const DragDropList = memo((props) => {
  const { dense, disableGutters, hasIcons, onChange, itemsData, selectedId, onClick, backgrounds, width } = props;

  let alwaysTopItem = [];
  let nonTopItem = [];

  // it chunks items top items and others and id in item should be string
  itemsData.forEach((item, index) => {
    if (item?.alwaysTop) {
      alwaysTopItem.push({ ...item, id: `${item?.id}` });
    } else {
      nonTopItem.push({ ...item, id: `${item?.id}` });
    }
  });

  const [items, setItems] = useState([...alwaysTopItem, ...nonTopItem]);

  // it sends the higher component a reordered list
  if (typeof onChange === 'function') {
    onChange(items);
  }

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? backgrounds?.draggingOverBackground : backgrounds?.background,
    width: width,
  });

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? backgrounds?.draggingBackground : backgrounds?.background,

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const itemsList = reorder(items, result.source.index, result.destination.index, alwaysTopItem.length);

    // it sends the higher component a reordered list
    if (typeof onChange === 'function') {
      onChange(itemsList);
    }
    setItems(itemsList);
  };
  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item?.alwaysTop}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    <BaseListItem
                      ListComponent={DragDropList}
                      key={item.id || item.label}
                      selectedId={selectedId}
                      dense={dense}
                      disableGutters={disableGutters}
                      onClick={onClick}
                      item={item}
                      hasIcons={hasIcons}
                      level={1}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

DragDropList.displayName = 'DragDropList';

DragDropList.propTypes = {
  itemsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any,
      label: PropTypes.string,
      iconName: PropTypes.string,
      disabled: PropTypes.bool,
      divider: PropTypes.bool,
      selectable: PropTypes.bool,
      secondary: PropTypes.string,
      primary: PropTypes.string,
      textBold: PropTypes.bool,
    }),
  ),
  selectedId: PropTypes.any,
  onClick: PropTypes.func,
  dense: PropTypes.bool,
  disablePadding: PropTypes.bool,
  disableGutters: PropTypes.bool,
  level: PropTypes.number,
  hasIcons: PropTypes.bool,
  onChange: PropTypes.func,
  backgrounds: PropTypes.shape({
    draggingBackground: PropTypes.string,
    background: PropTypes.string,
    draggingOverBackground: PropTypes.string,
  }),
  width: PropTypes.number,
};

DragDropList.defaultProps = {
  dense: false,
  disablePadding: false,
  disableGutters: false,
  hasIcons: false,
  width: 250,
  selectedId: null,
  onClick: () => {},
  backgrounds: {
    background: colors.white,
    draggingBackground: colors.blue,
    draggingOverBackground: colors.grey,
  },
};

export { DragDropList };
