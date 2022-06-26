import { useState, useContext, useEffect } from 'react';

import { HotelContext, ToastContext, GlobalFilterContext } from 'contexts';
import { useDashboardComments, useHotelUser } from '../../../../graphql';
import { getText, isValidDate } from 'utils';
import logger from 'utils/logger';
import dayjs from 'dayjs';
import { onErrorHandle } from '../utils';

export const useAddDashboardComment = ({ args }) => {
  const { dashboardId, hideDrawer, widgetId, onHandleAddComment, hotelId } = args;
  const { dashboardCommentCreate: addComment, dashboardCommentCreateState: newComment } = useDashboardComments();
  const { hotelUserList, hotelUserListState } = useHotelUser();
  const { portfolio } = useContext(GlobalFilterContext);
  const { showToast } = useContext(ToastContext);
  const { hotels } = useContext(HotelContext);

  const [addState, updateState] = useState({
    hotelId: hotelId ?? portfolio.hotelId ?? null,
    kpiId: [], // must be like this if we're using multiple
    users: [],
    startDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
    endDate: portfolio?.primaryDashboardDate ?? new Date().setDate(new Date().getDate() - 1),
    comment: null,
    dashboardId: dashboardId,
    users: [], // to send
    usersList: [], // to show
  });

  // one more useEffect to fetch userList
  useEffect(() => {
    // get user list immediatelly
    const params = {
      hotelId: hotels.map((obj) => {
        return obj.id;
      }),
    };
    hotelUserList(params);
  }, [hotels]);

  // get user list
  useEffect(() => {
    if (hotelUserListState?.data || hotelUserListState?.errors?.length) {
      logger.debug('User list received: ', { hotelUserListState });

      if (
        Array.isArray(hotelUserListState?.data) &&
        hotelUserListState?.data?.length &&
        !hotelUserListState?.errors?.length
      ) {
        const usersList =
          hotelUserListState?.data.map((obj) => {
            return { label: obj.username, value: Number(obj.id) };
          }) || [];
        updateState((state) => ({
          ...state,
          usersList: usersList,
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hotelUserListState]);

  // when comment is added
  useEffect(() => {
    if (newComment?.data || newComment?.errors?.length) {
      logger.debug('Comment created data received: ', { newComment });

      if (Array.isArray(newComment?.data) && newComment?.data?.length && !newComment?.errors?.length) {
        showToast({ message: getText('dashboard.commentAddSuccess') });
        hideDrawer();
        if (onHandleAddComment) {
          onHandleAddComment({ widgetId });
        }
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [newComment]);

  const onHandleSave = (value) => {
    const { hotelId, message, startDate, endDate } = value;

    let kpiId = value.kpiId;
    if (!Array.isArray(kpiId)) {
      kpiId = [];
    }

    let users = value.users;
    if (!Array.isArray(users)) {
      users = [];
    }

    const params = {
      hotelId,
      message,
      dashboardId: addState.dashboardId,
      kpiId: kpiId?.map((obj) => {
        return obj.value;
      }),
      //values are already numbers...
      userId: users?.map((obj) => {
        return obj.value;
      }),
      // delete these 2 lines and uncomment below lines once we allow dates to be optional.
      startDate: dayjs(startDate).format('MM/DD/YYYY'),
      endDate: dayjs(endDate).format('MM/DD/YYYY'),
    };
    /**
     * if (startDate) {
      params.startDate = dayjs(startDate).format('MM/DD/YYYY');
    }
    if (endDate) {
      params.endDate = dayjs(endDate).format('MM/DD/YYYY');
    } */

    logger.debug('Add comment with input values:', value, ' and params: ', params);

    // uncomment this line once we have dates optional
    //if ((startDate && isValidDate(startDate)) || (endDate && isValidDate(endDate))

    if (isValidDate(startDate) && isValidDate(endDate)) {
      addComment(params);
    }
  };

  const onHandleCancel = () => {
    hideDrawer();
  };

  return {
    state: addState,
    onHandleSave,
    onHandleCancel,
    onErrorHandle,
  };
};
