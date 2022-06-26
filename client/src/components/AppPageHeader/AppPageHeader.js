import React, { Fragment, memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AppHeader, SearchableDropdown, HeaderItem } from 'mdo-react-components';
import { UserContext, AppContext, OrganizationContext } from '../../contexts';
import { MdoLogo } from '../MdoLogo';
import { MypLogo } from '../MypLogo';
import logger from '../../utils/logger';
import { uniqBy } from 'lodash';
import { getText, search } from '../../utils/localesHelpers';
import { appSettings } from '../../config/appSettings';

import { FullWidthHeaderItem, SearchItem } from './styled';
import { OrganizationDropdown } from 'components';

const AppPageHeader = memo((props) => {
  const { logout } = useAuth0();
  const { user, clearUserInfo, setUserInfo } = useContext(UserContext);
  const { organizations } = useContext(OrganizationContext);
  const { appPages } = useContext(AppContext);
  const history = useHistory();
  const { picture, name } = user;

  const handleClick = (item) => {
    if (item.id === 'logout') {
      logout({ returnTo: window.location.origin });
      clearUserInfo();
    }
  };

  const handleChangeSearch = (name, value) => {
    logger.debug('Go to the page:', value);
    history.push(value);
  };

  const handleChangeOrg = (name, value) => {
    logger.debug('Organization has changed:', value);
    setUserInfo({
      ...user,
      orgId: Number(value),
    });
  };

  const searchItems = useMemo(() => {
    const items = [];

    if (Array.isArray(appPages?.data)) {
      items.push(
        ...appPages.data
          .filter((item) => search(item.url, ':') === -1 && item.url !== '*')
          .map((item) => {
            return {
              label: item.name,
              url: item.url,
            };
          }),
      );
    }

    return uniqBy(items, 'label');
  }, [appPages]);

  return (
    <AppHeader
      rightIconName='ExpandMoreOutlined'
      name={name}
      logo={'/mdo_logo_color.svg'}
      onLogout={handleClick}
      picture={picture}
      menuItems={[]}
    >
      <FullWidthHeaderItem>
        <HeaderItem>
          <MdoLogo />
        </HeaderItem>
        <HeaderItem>
          <MypLogo />
        </HeaderItem>
        <HeaderItem toTheRight />
        {organizations.data.length > 1 && (
          <HeaderItem>
            <SearchItem>
              <OrganizationDropdown onChange={handleChangeOrg} value={user.orgId} />
            </SearchItem>
          </HeaderItem>
        )}
        {['LOCAL', 'DEV', 'UAT'].indexOf(appSettings.appEnvironment) !== -1 && (
          <HeaderItem>
            <SearchItem>
              <SearchableDropdown
                placeholder={getText('generic.search')}
                onChange={handleChangeSearch}
                itemName='label'
                valueName='url'
                items={searchItems}
                dataEl='searchGlobal'
              />
            </SearchItem>
          </HeaderItem>
        )}
      </FullWidthHeaderItem>
    </AppHeader>
  );
});

AppPageHeader.displayName = 'AppHeader';

AppPageHeader.propTypes = {
  onSideBarToggle: PropTypes.func,
};

export { AppPageHeader };
