import React, { useState, useContext, useEffect } from 'react';

import { HotelContext, DrawerContext } from 'contexts';
import { useDashboardComments } from '../../../../graphql';
import logger from 'utils/logger';
import { WIDGET_ID } from '../constants';
import { ViewDashboardComment } from '../components';

// this hook is called from the tableValue and it will will fetch all status 100
// comments.
export const useComments = (widgetId, dashboardId, onViewAllComments) => {
  const {
    // to list all comments
    dashboardCommentList,
    dashboardCommentListState,
  } = useDashboardComments();
  const { showDrawer, hideDrawer } = useContext(DrawerContext);
  const { hotels } = useContext(HotelContext);

  const [propertyCommentState, updateState] = useState({
    dashboardId: dashboardId,
    widgetId: widgetId,
    hotelComments: [],
    allComments: [],
  });

  // fetch all comments if we're in the right widget
  useEffect(() => {
    if (widgetId === WIDGET_ID.BY_PROPERTY) {
      const params = {
        commentStatusId: 100, // only valid
        dashboardId: dashboardId,
        hotelId: hotels.map((obj) => {
          //all hotels for this user
          return obj.id;
        }),
      };
      dashboardCommentList(params);
    }
  }, [hotels]);

  // process comment list
  useEffect(() => {
    if (dashboardCommentListState?.data || dashboardCommentListState?.errors?.length) {
      logger.debug('Comment list received: ', { dashboardCommentListState });

      if (
        Array.isArray(dashboardCommentListState?.data) &&
        dashboardCommentListState?.data?.length &&
        !dashboardCommentListState?.errors?.length
      ) {
        let hotelComments = [];
        dashboardCommentListState?.data?.map((obj) => {
          if (obj.hotelId && !hotelComments.includes(obj.hotelId)) {
            hotelComments.push(obj.hotelId);
          }
        }) || [];

        updateState((state) => ({
          ...state,
          hotelComments,
          allComments: dashboardCommentListState?.data,
        }));
      } else {
        // we don't want to show toast if we fail while we're loading dashboard table value
        // showToast({
        //   severity: 'error',
        //   message: getText('generic.genericToastError'),
        // });
      }
    }
  }, [dashboardCommentListState]);

  const onHandleCancel = (value) => {
    hideDrawer();
  };

  const onHandleViewAllComments = () => {
    // redirect to view all comments
  };

  const onChange = (name, value) => {
    updateState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleOnCommentClick = (hotelId) => {
    showDrawer({
      content: (
        <ViewDashboardComment onHandleCancel={onHandleCancel} hotelId={hotelId} onViewAllComments={onViewAllComments} />
      ),
    });
  };

  return {
    state: propertyCommentState,
    onHandleCancel,
    handleOnCommentClick,
    onHandleViewAllComments,
    onChange,
  };
};
