import React, { useState, useContext, useEffect } from 'react';

import { globals, usePageState } from 'hooks';
import { HotelContext, AppContext, DrawerContext, ToastContext, GlobalFilterContext } from 'contexts';
import { useDashboardComments, useHotelUser } from '../../../graphql';
import { AddEditDashboardComment } from 'components';
import logger from 'utils/logger';
import { getText, direction } from 'utils';
import { filterOutComments, prepareAllComments } from './utils';
import { pageState } from './constants';

export const useDashboardComment = (slug, hotelId) => {
  const {
    dashboardCommentList,
    dashboardCommentListState,
    dashboardCommentCreate: addReply,
    dashboardCommentCreateState: newReply,
    dashboardCommentStatusSet,
    dashboardCommentStatusSetState,
  } = useDashboardComments();
  const { hotelUserList, hotelUserListState } = useHotelUser();
  const { hotels } = useContext(HotelContext);
  const { dashboards } = useContext(AppContext);
  const { showDrawer, hideDrawer } = useContext(DrawerContext);
  const { showToast } = useContext(ToastContext);
  const { portfolio, assignGlobalValue } = useContext(GlobalFilterContext);
  const { updatePageState } = usePageState(pageState);

  const [commentState, updateState] = useState({
    hotelId: hotelId ?? portfolio.hotelId,
    userId: 0,
    errors: [], // errors for the elements
    usersList: [{ value: 0, label: getText('generic.allUsers') }],
    commentStatusId: 100,
    sortOrder: direction.DESC,
    pageState: { ...updatePageState(pageState.LOADING) },
    requestReport: false,
  });

  // retrieve all comments when hotels is here...
  useEffect(() => {
    if (hotels?.length) {
      const params = {
        dashboardId: dashboards?.slugs[slug]?.id,
        hotelId: hotels.map((obj) => {
          //all hotels for this user
          return obj.id;
        }),
      };
      dashboardCommentList(params);
    }
  }, [hotels, dashboards]);

  // one more useEffect to fetch userList
  useEffect(() => {
    if (hotels?.length) {
      // get user list immediatelly
      const params = {
        hotelId: hotels.map((obj) => {
          return obj.id;
        }),
      };
      hotelUserList(params);
    }
  }, [hotels]);

  // process comment list
  useEffect(() => {
    if (dashboardCommentListState?.data || dashboardCommentListState?.errors?.length) {
      if (
        Array.isArray(dashboardCommentListState?.data) &&
        dashboardCommentListState?.data?.length >= 0 &&
        !dashboardCommentListState?.errors?.length
      ) {
        const { parentComments, replyComments } = prepareAllComments(dashboardCommentListState?.data);
        const filteredComments = filterOutComments(parentComments, commentState);
        updateState((state) => ({
          ...state,
          parentComments: filteredComments,
          allParentComments: parentComments,
          requestReport: false,
          replyComments,
          pageState: updatePageState(filteredComments.length > 0 ? pageState.NONE : pageState.MESSAGE),
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
        updateState((state) => ({
          ...state,
          requestReport: false,
        }));
      }
    }
  }, [dashboardCommentListState]);

  // when user list is fetched
  useEffect(() => {
    if (hotelUserListState?.data || hotelUserListState?.errors?.length) {
      if (
        Array.isArray(hotelUserListState?.data) &&
        hotelUserListState?.data?.length >= 0 &&
        !hotelUserListState?.errors?.length
      ) {
        const usersList =
          hotelUserListState?.data.map((obj) => {
            return { label: obj.username, value: Number(obj.id) };
          }) || [];
        updateState((state) => ({
          ...state,
          usersList: [{ value: 0, label: getText('generic.allUsers') }, ...usersList],
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [hotelUserListState]);

  // when reply is added
  useEffect(() => {
    if (newReply?.data || newReply?.errors?.length) {
      logger.debug('Comment created data received: ', { newReply });

      if (Array.isArray(newReply?.data) && newReply?.data?.length && !newReply?.errors?.length) {
        // reply successfully added, refetch all  replies...
        const params = {
          dashboardId: newReply.data?.[0].dashboardId,
          hotelId: hotels.map((obj) => {
            //all hotels for this user
            return obj.id;
          }),
        };
        dashboardCommentList(params);
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [newReply]);

  // when status is updated
  useEffect(() => {
    if (dashboardCommentStatusSetState?.data || dashboardCommentListState?.errors?.length) {
      if (
        Array.isArray(dashboardCommentStatusSetState?.data) &&
        dashboardCommentStatusSetState?.data?.length &&
        !dashboardCommentStatusSetState?.errors?.length
      ) {
        showToast({
          message: getText('dashboard.commentStatusUpdatedSuccess'),
        });

        const params = {
          dashboardId: dashboards?.slugs[slug]?.id,
          hotelId: hotels.map((obj) => {
            //all hotels for this user
            return obj.id;
          }),
        };

        dashboardCommentList(params);
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [dashboardCommentStatusSetState]);

  const onChange = (name, value) => {
    const filteredComments = filterOutComments(commentState.allParentComments, commentState, name, value);
    updateState((state) => ({
      ...state,
      [name]: value,
      parentComments: filteredComments,
      pageState: updatePageState(filteredComments.length > 0 ? pageState.NONE : pageState.MESSAGE),
    }));
    // here filter out comments based on name and value
  };

  const onHandleAddComment = () => {
    // when new comment is added, re-fetch all again...

    const params = {
      dashboardId: dashboards?.slugs[slug]?.id,
      hotelId: hotels.map((obj) => {
        //all hotels for this user
        return obj.id;
      }),
    };
    dashboardCommentList(params);
  };

  const onAddDashboardComment = () => {
    const args = {
      dashboardId: dashboards?.slugs[slug]?.id,
      hideDrawer: hideDrawer,
      onHandleAddComment: onHandleAddComment,
      hotelId: commentState.hotelId,
    };
    showDrawer({
      content: <AddEditDashboardComment args={args} />,
    });
  };

  const onHandleSubmitReply = ({ message, id }) => {
    const parentComment = commentState.parentComments.find((obj) => obj.id === id) || null;

    if (parentComment) {
      const params = {
        hotelId: parentComment.hotelId,
        message: message,
        dashboardId: parentComment.dashboardId,
        kpiId:
          // be carefull here, we get kpis from query but we need to provide kipId when create/update, both arrays
          parentComment.kpis?.map((obj) => {
            return obj.id;
          }) || [],
        userId:
          parentComment.users?.map((obj) => {
            return Number(obj.id);
          }) || [],
        startDate: parentComment.startDate,
        endDate: parentComment.endDate,
        parentCommentId: id,
      };
      updateState((state) => ({
        ...state,
        requestReport: true,
      }));
      addReply(params);
    } else {
      logger.debug('Parent comment not found: ', id);
    }
  };

  const onHandleActiveResolveComment = ({ status, id }) => {
    const params = {
      commentStatusId: status,
    };
    updateState((state) => ({
      ...state,
      requestReport: true,
    }));
    dashboardCommentStatusSet(id, params);
  };

  return { state: commentState, onChange, onAddDashboardComment, onHandleSubmitReply, onHandleActiveResolveComment };
};
