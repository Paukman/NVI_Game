import { useState, useContext, useEffect } from 'react';

import { ToastContext } from 'contexts';
import { useDashboardComments } from '../../../../graphql';
import { getText } from 'utils';
import logger from 'utils/logger';
import { sortBy } from 'lodash';
import { prepareReplayAndParentComments } from '../utils';

export const useCommentReply = (hotelId) => {
  const {
    dashboardCommentCreate: addComment,
    dashboardCommentCreateState: newComment,
    dashboardCommentList,
    dashboardCommentListState,
  } = useDashboardComments();
  const { showToast } = useContext(ToastContext);

  const [propertyCommentState, updateState] = useState({
    reply: '',
    hotelId: hotelId,
    dashboardId: null,
    replyComments: null,
    parentComment: null,
  });

  // fetch all comments if we're in the right widget
  useEffect(() => {
    if (hotelId) {
      const params = {
        //commentStatusId: 100, // only valid
        dashboardId: propertyCommentState?.dashboardId,
        hotelId: hotelId,
      };
      updateState((state) => ({
        ...state,
        reply: '',
        dashboardId: null,
        replyComments: null,
        parentComment: null,
      }));

      dashboardCommentList(params);
    }
  }, [hotelId]);

  // process comment list
  useEffect(() => {
    if (dashboardCommentListState?.data || dashboardCommentListState?.errors?.length) {
      logger.debug('Comment list received: ', { dashboardCommentListState });

      if (
        Array.isArray(dashboardCommentListState?.data) &&
        dashboardCommentListState?.data?.length &&
        !dashboardCommentListState?.errors?.length
      ) {
        const { replyComments, parentComment } = prepareReplayAndParentComments(
          dashboardCommentListState?.data,
          propertyCommentState,
        );

        updateState((state) => ({
          ...state,
          reply: '',
          replyComments,
          parentComment,
        }));
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [dashboardCommentListState]);

  // when reply is added
  useEffect(() => {
    if (newComment?.data || newComment?.errors?.length) {
      logger.debug('Comment created data received: ', { newComment });

      if (Array.isArray(newComment?.data) && newComment?.data?.length && !newComment?.errors?.length) {
        // reply successfully added, refetch all  replies...
        const params = {
          commentStatusId: 100, // only valid
          dashboardId: propertyCommentState.parentComment.dashboardId,
          hotelId: propertyCommentState.parentComment.hotelId,
          parentCommentId: propertyCommentState.parentComment.id,
        };
        dashboardCommentList(params);
      } else {
        showToast({
          severity: 'error',
          message: getText('generic.genericToastError'),
        });
      }
    }
  }, [newComment]);

  const onHandleSubmitReply = (message) => {
    const params = {
      hotelId: propertyCommentState.parentComment.hotelId,
      message: message || propertyCommentState.reply,
      dashboardId: propertyCommentState.parentComment.dashboardId,
      kpiId:
        // be carefull here, we get kpis from query but we need to provide kipId when create/update, both arrays
        propertyCommentState.parentComment.kpis?.map((obj) => {
          return obj.id;
        }) || [],
      userId:
        propertyCommentState.parentComment.users?.map((obj) => {
          return Number(obj.id);
        }) || [],
      startDate: propertyCommentState.parentComment.startDate,
      endDate: propertyCommentState.parentComment.endDate,
      parentCommentId: propertyCommentState.parentComment.id,
    };
    addComment(params);
  };

  const onChange = (name, value) => {
    updateState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return {
    state: propertyCommentState,
    onHandleSubmitReply,
    onChange,
  };
};
