import React, { useState, memo } from 'react';

import { getText } from 'utils';
import { Button, Content, LinkActions, Collapse, InputField, colors, Icon } from 'mdo-react-components';
import {
  AllCommentReplyMessageStyling,
  ButtonLinkStyling,
  ReplyLabel,
  ViewAllCommentContainer,
  SingleCommentContainer,
} from '../styled';
import { ParentComment } from './ParentComment';
import { localColors } from 'config/colors';

import { Reply } from './Reply';
import { getReplyComponent, getActionsButtonsConfig } from '../utils';

const ViewAllDashboardComment = memo((props) => {
  const { parentComment, replyComments, onHandleSubmitReply, onHandleActiveResolveComment } = props;
  const [viewAllReplies, updateViewAllReplies] = useState(false);
  const [message, updateMessage] = useState('');

  return (
    <>
      <ViewAllCommentContainer>
        {Number(parentComment?.commentStatusId) === 100 ? (
          <Icon name='Feedback' color={localColors.BRIGHT_ORANGE} size='20' />
        ) : (
          <Icon name='CommentResolved' color={localColors.ICON_GREY} size='20' />
        )}
        <SingleCommentContainer>
          <>
            {parentComment && (
              <ParentComment
                isAllComment={true}
                parentComment={parentComment}
                onHandleActiveResolveComment={onHandleActiveResolveComment}
              />
            )}
            {replyComments?.length > 0 && (
              <>
                <ReplyLabel>
                  <label>{`${getText(`generic.replies`)} (${replyComments?.length})`}</label>
                  {replyComments?.length > 1 && (
                    <LinkActions
                      items={getActionsButtonsConfig(viewAllReplies)}
                      onClick={() => updateViewAllReplies(!viewAllReplies)}
                      style={{ padding: 0 }}
                      hasFont
                      noPadding
                    />
                  )}
                </ReplyLabel>
                {viewAllReplies ? (
                  <Collapse open={viewAllReplies}>
                    <Content mt={17} mb={17} ml={20} mr={0}>
                      {getReplyComponent(replyComments, viewAllReplies)}
                    </Content>
                  </Collapse>
                ) : (
                  <Content mt={17} mb={17} ml={20} mr={0}>
                    <Reply
                      key={0}
                      username={replyComments[0].userCreated.username}
                      message={replyComments[0].message}
                      createdAt={replyComments[0].createdAt}
                      index={0}
                      open={viewAllReplies}
                      color={colors.black}
                    />
                  </Content>
                )}
              </>
            )}
          </>
          {parentComment && (
            <AllCommentReplyMessageStyling>
              <InputField
                style={{ padding: '8px', marginRight: '5px', height: '51px', flexDirection: 'inherit' }}
                name='reply'
                value={message}
                onChange={(_, value) => updateMessage(value)}
                placeholder={getText('generic.reply')}
                variant={'outlined'}
                dataEl='inputFieldAddComment'
                fontSize={12}
              />
              <ButtonLinkStyling>
                <Button
                  text={getText('generic.submit')}
                  variant='success'
                  title={getText('generic.submit')}
                  onClick={() => {
                    updateMessage('');
                    onHandleSubmitReply({ message, id: parentComment.id });
                  }}
                  dataEl='buttonSubmitReply'
                  disabled={!message}
                />
              </ButtonLinkStyling>
            </AllCommentReplyMessageStyling>
          )}
        </SingleCommentContainer>
      </ViewAllCommentContainer>
      {parentComment && <hr style={{ height: '1px', width: '88%' }} />}
    </>
  );
});

ViewAllDashboardComment.displayName = 'ViewAllDashboardComment';

export { ViewAllDashboardComment };
