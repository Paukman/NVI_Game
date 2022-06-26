import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '../Drawer';
import { ButtonsGroup } from '../FormElements/ButtonsGroup';
import { Button } from '../FormElements/Button';
import { IconDiv, ButtonDiv, TitleDev, HeaderDiv, Container } from './styled';

const SlideBar = memo((props) => {
  const {
    title,
    children,
    showButtons,
    buttonSaveText,
    buttonCancelText,
    onCancel,
    onSave,
    showCloseIcon,
    anchor,
    open,
    buttonSaveVariant,
  } = props;
  const items = [
    {
      clickId: 'cancel',
      text: buttonCancelText,
      width: '120px',
    },
    {
      clickId: 'save',
      text: buttonSaveText,
      variant: buttonSaveVariant,
      width: '120px',
    },
  ];

  const handleClick = (event) => {
    switch (event?.clickId) {
      case 'cancel':
        if (typeof onCancel === 'function') {
          onCancel();
        }
        break;

      case 'save':
        if (typeof onSave === 'function') {
          onSave();
        }
        break;
      default:
      case 'cancel':
        if (typeof onCancel === 'function') {
          onCancel();
        }
    }
  };

  const header = (
    <HeaderDiv>
      <TitleDev>{title}</TitleDev>
      <IconDiv showCloseIcon={showCloseIcon}>
        <Button onClick={handleClick} iconName='Close' variant='tertiary' />
      </IconDiv>
    </HeaderDiv>
  );

  const footer = (
    <ButtonDiv showButtons={showButtons}>
      <ButtonsGroup onClick={handleClick} items={items} />
    </ButtonDiv>
  );

  return (
    <Drawer open={open} anchor={anchor} onClose={handleClick}>
      <Container>
        {header}
        {children}
        {footer}
      </Container>
    </Drawer>
  );
});

SlideBar.anchors = ['left', 'top', 'right', 'bottom'];
SlideBar.variants = ['h1', 'h2', 'h3', 'h4', 'h5'];
SlideBar.displayName = 'SlideBar';

SlideBar.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  showButtons: PropTypes.bool,
  showCloseIcon: PropTypes.bool,
  buttonSaveText: PropTypes.string,
  buttonCancelText: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  anchor: PropTypes.string,
  open: PropTypes.bool,
  buttonSaveVariant: PropTypes.string,
};

SlideBar.defaultProps = {
  showCloseIcon: true,
  showButtons: true,
  buttonSaveVariant: 'success',
};

export { SlideBar };
