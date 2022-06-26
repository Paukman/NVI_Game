import React, { memo, Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ListTextSearch } from '../../List/ListTextSearch';
import { Drawer } from '../../Drawer';
import { Button } from '../Button';
import { Typography } from '../../Typography';
import { handleInputChange } from '../../../utils/formHelpers';
import { Content } from '../Content';
import { DataLoading } from '../../DataLoading';

import { Wrapper, ListtextSearchWrapper } from './styled';

const ButtonSideBar = memo((props) => {
  const { text, iconName, variant, disabled, name, id, onChange, anchor, searchLabel, items, title, value, dataEl } =
    props;
  const [open, setOpen] = useState(false);
  const [listItems, setListItems] = useState(null);

  const handleClick = useCallback((event) => handleInputChange({ id, name, onChange })(event), [id, name, onChange]);

  useEffect(() => {
    // This is done to make drawer open first before starting renering list
    // as if there are too many items it can take some seconds
    if (open) {
      setTimeout(() => {
        setListItems(
          <ListTextSearch
            dataEl={`${dataEl}-list`}
            height='100%'
            label={searchLabel}
            items={items}
            selectedId={value}
            onClick={(item) => {
              handleClick({ target: { value: item } });
              setOpen(false);
            }}
          />,
        );
      }, 100);
    } else {
      setListItems(() => {
        setListItems(null);
      }, 100);
    }
  }, [open, dataEl, searchLabel, value, items, handleClick]);

  return (
    <Fragment>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
        text={text}
        iconName={iconName}
        variant={variant}
        disabled={disabled}
        dataEl={`${dataEl}-button`}
      />
      <Drawer anchor={anchor} open={open} onClose={() => setOpen(false)}>
        <Wrapper>
          {title && (
            <Content pb={20}>
              <Typography data-el={`${dataEl}-title`}>{title}</Typography>
            </Content>
          )}
          <ListtextSearchWrapper>
            {!listItems && <DataLoading />}
            {listItems}
          </ListtextSearchWrapper>
        </Wrapper>
      </Drawer>
    </Fragment>
  );
});

ButtonSideBar.anchors = Drawer.anchors;

ButtonSideBar.displayName = 'ButtonSideBar';

ButtonSideBar.propTypes = {
  ...ListTextSearch.prototype,
  ...Button.propTypes,
  title: PropTypes.string,
  anchor: PropTypes.string,
  searchLabel: PropTypes.string,
  items: PropTypes.array,
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  text: PropTypes.string,
  dataEl: PropTypes.string,
};

ButtonSideBar.defaultProps = {
  anchors: 'right',
  searchLabel: 'Search',
  open: true,
};

export { ButtonSideBar };
