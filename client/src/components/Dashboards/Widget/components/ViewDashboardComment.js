import React, { useState, memo } from 'react';
import { getText } from 'utils';
import {
  ToolBarItem,
  Button,
  ToolBar,
  Grid,
  Content,
  LinkActions,
  Collapse,
  InputField,
  colors,
} from 'mdo-react-components';

import { AddCommentContainer, ReplyMessageStyling, ButtonLinkStyling, ReplyLabel } from '../styled';
import { ParentComment } from './ParentComment';

import { Reply } from './Reply';
import { useCommentReply } from '../hooks';
import { getReplyComponent, actionsButtons, getActionsButtonsConfig } from '../utils';

const ViewDashboardComment = memo((props) => {
  const { onHandleCancel, hotelId, onViewAllComments } = props;
  const { state, onHandleSubmitReply } = useCommentReply(hotelId);
  const [isViewAll, setOpen] = useState(false);

  const [message, updateMessage] = useState('');

  return (
    <>
      <ToolBar>
        <ToolBarItem toTheRight>
          <Button
            iconName='Close'
            text=''
            variant='tertiary'
            title={getText('generic.close')}
            onClick={onHandleCancel}
            dataEl='buttonXCancel'
          />
        </ToolBarItem>
      </ToolBar>
      <AddCommentContainer>
        <>
          {state?.parentComment && <ParentComment parentComment={state.parentComment} />}
          {state?.replyComments?.length > 0 && (
            <>
              <ReplyLabel>
                <label>{`${getText(`generic.replies`)} (${state.replyComments.length})`}</label>
                {state?.replyComments?.length > 1 && (
                  <LinkActions
                    items={getActionsButtonsConfig(isViewAll)}
                    onClick={() => setOpen(!isViewAll)}
                    style={{ padding: 0 }}
                    hasFont
                    noPadding
                  />
                )}
              </ReplyLabel>
              {isViewAll ? (
                <Collapse open={isViewAll}>
                  <Content mt={17} mb={17} ml={20} mr={0}>
                    {getReplyComponent(state?.replyComments, isViewAll)}
                  </Content>
                </Collapse>
              ) : (
                <Content mt={17} mb={17} ml={20} mr={0}>
                  <Reply
                    key={0}
                    username={state.replyComments[0].userCreated.username}
                    message={state.replyComments[0].message}
                    createdAt={state.replyComments[0].createdAt}
                    index={0}
                    open={isViewAll}
                    color={colors.black}
                  />
                </Content>
              )}
            </>
          )}
        </>
        <ReplyMessageStyling>
          <InputField
            name='reply'
            value={message}
            onChange={(_, value) => updateMessage(value)}
            label={getText('generic.addComment')}
            variant={'outlined'}
            multiline={true}
            rows={3}
            maxRows={3}
            fontSize={14}
            maxNoOfChars={500}
            dataEl='inputFieldAddComment'
          />
        </ReplyMessageStyling>
        <Content mt={15} mb={64} ml={0} mr={0}>
          <Grid alignItems='center' direction='row' justify='space-between'>
            <div style={{ paddingBottom: '20px' }}>
              <LinkActions
                items={[
                  {
                    clickId: 'viewAllComments',
                    text: getText('dashboard.viewAllComments'),
                    variant: 'tertiary',
                    color: colors.blue,
                    fontWeight: 600,
                  },
                ]}
                onClick={() => {
                  onViewAllComments(hotelId);
                  onHandleCancel();
                }}
                hasFont
                noPadding
              />
            </div>
            <ButtonLinkStyling>
              <Button
                text='Submit'
                variant='success'
                title={getText('generic.submit')}
                onClick={() => {
                  updateMessage('');
                  onHandleSubmitReply(message);
                }}
                dataEl='buttonSubmitReply'
                disabled={!message}
              />
            </ButtonLinkStyling>
          </Grid>
        </Content>
      </AddCommentContainer>
    </>
  );
});

ViewDashboardComment.displayName = 'ViewDashboardComment';

export { ViewDashboardComment };
