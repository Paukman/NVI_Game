import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Header, HeaderItem } from '../Header';
import { ButtonDropdown } from '../FormElements/ButtonDropdown';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const AppHeader = memo((props) => {
  const {
    name,
    logo,
    iconName,
    rightIconName,
    onLogout,
    picture,
    children,
    bgColor,
    color,
    menuItems,
    onMenuItemClick,
    dataEl,
    dataElHeaderMenu,
    dataElLogout,
  } = props;

  return (
    <Header bgColor={bgColor} color={color} username={name} logo={logo} onLogout={onLogout} data-el={dataEl}>
      {children}
      {picture !== '' && (
        <HeaderItem toTheRight>
          <img src={picture} alt='user avatar' height={32} />
        </HeaderItem>
      )}
      {picture !== '' && (
        <HeaderItem>
          <ButtonDropdown
            dataEl={dataElHeaderMenu}
            onClick={(item) => {
              if (item.url === '#logout') {
                if (typeof onLogout === 'function') {
                  onLogout(item);
                }
              } else {
                onMenuItemClick(item);
              }
            }}
            iconName={iconName}
            rightIconName={rightIconName}
            variant='none'
            text={name}
            items={[
              ...menuItems,
              {
                url: '#logout',
                id: 'logout',
                label: 'logout',
                icon: 'ExitToApp',
                dataEl: dataElLogout,
              },
            ]}
          />
        </HeaderItem>
      )}
    </Header>
  );
});

AppHeader.displayName = 'AppHeader';

AppHeader.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  onLogout: PropTypes.func,
  picture: PropTypes.string,
  iconName: PropTypes.string,
  rightIconName: PropTypes.string,
  children: PropTypes.element,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  onMenuItemClick: PropTypes.func,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      dataEl: PropTypes.string,
    }),
  ),
  dataEl: PropTypes.string,
  dataElHeaderMenu: PropTypes.string,
  dataElLogout: PropTypes.string,
};

AppHeader.defaultProps = {
  bgColor: colors.white,
  color: colors.darkGray,
  dataEl: 'appHeader',
  dataElHeaderMenu: 'loggedUsername',
  dataElLogout: 'buttonLogout',
};

export { AppHeader };
