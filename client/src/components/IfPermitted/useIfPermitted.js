import { useContext } from 'react';
import { AppContext } from 'contexts';
import { logger } from 'utils';
// if react compoment is not enough, we can use hook to
// get permission for the particular type on page/dashboard
export const useIfPermitted = ({ page, dashboardPage }) => {
  const { permissions } = useContext(AppContext);

  const isPermitted = (permissionType) => {
    const isPagePermissionPermitted = permissions?.page?.[page]?.includes(permissionType);
    const isDashboardPermissionPermitted = permissions?.dashboard?.[dashboardPage]?.includes(permissionType);

    // un-comment this when testing
    // logger.debug(
    //   'Permission for',
    //   page || dashboardPage,
    //   ' and type',
    //   permissionType,
    //   ' is ',
    //   isPagePermissionPermitted || isDashboardPermissionPermitted,
    // );
    return isPagePermissionPermitted || isDashboardPermissionPermitted;
  };

  return { isPermitted };
};
