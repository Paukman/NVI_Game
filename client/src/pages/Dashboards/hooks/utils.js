import { stableSort, getComparator } from 'utils';
import { DASHBOARD_COMMENT_STATUS } from 'config/constants';

export const filterOutComments = (parentComments, state, name, value) => {
  let filteredParentComments = [...parentComments];
  const reducedState = {
    hotelId: state?.hotelId,
    userId: state?.userId,
    commentStatusId: state?.commentStatusId,
    sortOrder: state?.sortOrder,
    [name]: value, // will overwirte any previous
  };

  // 1. by property
  if (reducedState.hotelId !== 0) {
    filteredParentComments = filteredParentComments?.filter((obj) => obj.hotelId === reducedState?.hotelId) || [];
  }
  // 2. by state
  if (reducedState.commentStatusId !== DASHBOARD_COMMENT_STATUS.ALL.value) {
    filteredParentComments =
      filteredParentComments?.filter((obj) => obj.commentStatusId === reducedState.commentStatusId) || [];
  }

  // 3. by users
  if (reducedState.userId !== 0) {
    filteredParentComments =
      filteredParentComments?.filter((obj) => {
        if (obj?.users?.find((user) => user.id === reducedState.userId.toString())) {
          return true;
        }
        return false;
      }) || [];
  }

  // 4. now sort by date
  filteredParentComments = stableSort(filteredParentComments, getComparator(reducedState.sortOrder, 'createdAt'));
  return filteredParentComments;
};

export const prepareAllComments = (data) => {
  if (!data || data?.length === 0) {
    return { parentComments: [], replyComments: [] };
  }
  let parentComments = [];
  data.map((obj) => {
    if (!obj.parentCommentId) {
      parentComments.push(obj);
    }
  });
  let replyComments = {};

  data.map((obj) => {
    if (obj.parentCommentId) {
      replyComments[obj.parentCommentId] = [...(replyComments?.[obj?.parentCommentId] || []), obj];
    }
  });

  return { parentComments, replyComments };
};
