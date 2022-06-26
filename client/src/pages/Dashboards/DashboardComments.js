import React, { memo, useContext } from 'react';
import { useHistory, useParams, useLocation } from 'react-router';
import { ToolBar, ToolBarItem, SearchableDropdown, Button } from 'mdo-react-components';

import { getText, strReplace } from 'utils';
import { useDashboardComment } from './hooks';
import {
  HotelSelector,
  GenericSelector,
  ViewAllDashboardComment,
  DisplayNoData,
  DataLoading,
  DisplayApiErrors,
  DataContainer,
} from 'components';
import { DASHBOARD_COMMENT_SORT_ORDER, DASHBOARD_COMMENT_STATUS } from 'config/constants';
import { AppContext } from 'contexts';
import { DashboardComment, CommentContainer } from './styled';

const DashboardComments = memo(() => {
  const { appPages } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const { slug } = params;

  const location = useLocation();
  const hotelId = location?.state?.hotelId;

  const { state, onChange, onAddDashboardComment, onHandleSubmitReply, onHandleActiveResolveComment } =
    useDashboardComment(slug, hotelId);

  return (
    <>
      <ToolBar>
        <ToolBarItem>
          <HotelSelector
            value={state?.hotelId || 0}
            name='hotelId'
            disableClearable
            onChange={onChange}
            helperText={state?.errors['hotelId'] || ''}
            error={!!state?.errors['hotelId']}
            addAll={true}
            required
          />
        </ToolBarItem>
        <ToolBarItem>
          <div style={{ minWidth: '300px', width: '100%' }}>
            <SearchableDropdown
              label={getText('dashboard.users')}
              name='userId'
              value={state?.userId || 0}
              disableClearable
              items={state?.usersList}
              itemName='label'
              onChange={onChange}
              dataEl='searchableDropdownUserLi'
            />
          </div>
        </ToolBarItem>
        <ToolBarItem>
          <GenericSelector
            width='medium'
            label={getText('generic.sort')}
            items={DASHBOARD_COMMENT_SORT_ORDER}
            value={state?.sortOrder}
            onChange={onChange}
            name='sortOrder'
          />
        </ToolBarItem>
        <ToolBarItem>
          <GenericSelector
            width='medium'
            label={getText('generic.viewing')}
            items={DASHBOARD_COMMENT_STATUS}
            value={state?.commentStatusId}
            onChange={onChange}
            name='commentStatusId'
          />
        </ToolBarItem>
        <ToolBarItem toTheRight>
          <Button
            text={getText('generic.addNew')}
            iconName='AddComment'
            variant='tertiary'
            title={getText('generic.addComment')}
            onClick={onAddDashboardComment}
            dataEl={'buttonAddComment'}
          />
        </ToolBarItem>
        <ToolBarItem style={{ marginBottom: '10px', marginRight: '10px' }}>
          <Button
            text={getText(`generic.imDone`)}
            title={getText(`generic.imDone`)}
            variant='success'
            onClick={() => {
              history.push({
                pathname: strReplace(`${appPages.keys['dashboards'].url}`, {
                  slug,
                }),
              });
            }}
            dataEl='buttonFinishCustomization'
          />
        </ToolBarItem>
      </ToolBar>
      <CommentContainer formPlacement='center' obsoleteData={state?.requestReport}>
        {state?.parentComments?.map((parentComment, index) => {
          return (
            <ViewAllDashboardComment
              key={index}
              parentComment={parentComment}
              replyComments={state?.replyComments[parentComment.id] || null}
              isAllComment={true}
              onHandleSubmitReply={onHandleSubmitReply}
              onHandleActiveResolveComment={onHandleActiveResolveComment}
            />
          );
        })}
      </CommentContainer>
      {!state?.parentComments?.length && (
        <>
          {state?.pageState.LOADING && <DataLoading />}
          {state?.pageState.ERROR && <DisplayApiErrors errors={state?.errors} />}
          {state?.pageState.MESSAGE && <DisplayNoData message={state?.pageState.MESSAGE} />}
        </>
      )}
    </>
  );
});

DashboardComments.displayName = 'DashboardComments';

export { DashboardComments };
