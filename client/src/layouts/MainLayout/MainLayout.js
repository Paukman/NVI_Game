import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';
import { Card } from 'mdo-react-components';

import { Button } from 'mdo-react-components';

import { AppContext, UserSettingsContext } from '../../contexts';
import { APP_SETTINGS_CODES } from '../../config/appSettings';

import { AppPageHeader, AppSideBar } from '../../components';

import {
  StyledMainLayout,
  StyledContent,
  PageHeader,
  PageTitle,
  CardContainer,
  LinkToMyp1Container,
  LinkToMyp1,
} from './styled';

const MainLayout = (props) => {
  const { children, page } = props;
  const { appPages, pageProps, setPageProps } = useContext(AppContext);

  const { userSettingsState } = useContext(UserSettingsContext);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const name = pageProps?.title || page?.name || '';
  const location = useLocation();
  const { mapSettingCode } = userSettingsState || {};

  useEffect(() => {
    // Each time page changes set custom page title to empty string so we could use default page name
    setPageProps({
      title: '',
    });
  }, [location, setPageProps]);

  useEffect(() => {
    // if user comes to the home page and user has custom default page is not home page
    // then redirect user to the default page
    const defaultPageUrl = appPages.keys[mapSettingCode[APP_SETTINGS_CODES.APP_DEFAULT_PAGE]]?.url ?? '';
    if (location.pathname === '/' && defaultPageUrl !== location.pathname) {
      history.push(defaultPageUrl);
    }
  }, [mapSettingCode]);

  return (
    <StyledMainLayout data-el='mainLayout'>
      <AppPageHeader onSideBarToggle={() => setOpen(!open)} />
      <AppSideBar
        open={open}
        onClose={() => setOpen(false)}
        onClick={(item) => {
          setOpen(false);
          if (item.url.startsWith('http')) {
            window.location.href = item.url;
          } else {
            history.push(item.url);
          }
        }}
      />
      <StyledContent>
        <PageHeader data-el='mainLayoutPageHeader'>
          <Button iconName='Menu' text='' variant='none' onClick={() => setOpen(!open)} dataEl='menuToggle' />
          <PageTitle data-el='pageName'>{name}</PageTitle>
          {page.options.metaInformation[APP_SETTINGS_CODES.MYP2_PAGES_URL] && (
            <LinkToMyp1Container>
              <LinkToMyp1 href={page.options.metaInformation[APP_SETTINGS_CODES.MYP2_PAGES_URL]} target='blank'>
                {page.options.metaInformation[APP_SETTINGS_CODES.MYP2_PAGES_NAME] || getText('generic.linkToMyp1')}
              </LinkToMyp1>
            </LinkToMyp1Container>
          )}
        </PageHeader>
        <Card scrollable={false} noTopPadding={true} data-el='mainLayoutCard'>
          <CardContainer data-el='mainLayoutCardContainer'>{children}</CardContainer>
        </Card>
      </StyledContent>
    </StyledMainLayout>
  );
};

MainLayout.displayName = 'MainLayout';

MainLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  page: PropTypes.any,
};

export { MainLayout };
