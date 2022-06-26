import React, { memo } from 'react';
import { Label, Content, colors } from 'mdo-react-components';

import { getText, timestampToShortLocal } from 'utils';
import { CommentHeader, Kpi, AllCommentHeader } from '../styled';
import { localColors } from 'config/colors';
import dayjs from 'dayjs';

const ParentComment = memo((props) => {
  const { parentComment, isAllComment, onHandleActiveResolveComment } = props;
  const commentStatusId = Number(parentComment?.commentStatusId);

  return (
    <>
      {parentComment && (
        <>
          {!isAllComment ? (
            <>
              <Label
                label={getText('generic.comment')}
                fontSize={20}
                fontWeight={600}
                style={{ paddingBottom: '10px' }}
              />
              <CommentHeader>
                <Label
                  label={parentComment.userCreated.username}
                  fontSize={16}
                  fontWeight={600}
                  color={colors.widgetsPlum}
                />
                <Label
                  label={timestampToShortLocal({ timestamp: parentComment.createdAt, format: 'MM/DD/YYYY LT' })}
                  fontSize={12}
                  fontWeight={600}
                />
              </CommentHeader>
            </>
          ) : (
            <AllCommentHeader>
              <Label
                label={parentComment.userCreated.username}
                fontSize={16}
                fontWeight={600}
                color={colors.widgetsPlum}
              />
              <div style={{ width: '210px', display: 'flex', justifyContent: 'flex-end' }}>
                <Label
                  label={commentStatusId === 100 ? getText('generic.resolve') : getText('generic.markActive')}
                  onClick={() => {
                    onHandleActiveResolveComment({
                      id: parentComment.id,
                      status: commentStatusId === 100 ? 0 : 100,
                    });
                  }}
                  fontSize={12}
                  fontWeight={600}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: commentStatusId === 100 ? localColors.ICON_GREY : '',
                    border: commentStatusId === 100 ? '' : `solid 1px ${localColors.ICON_GREY}`,
                    color: commentStatusId === 100 ? colors.white : localColors.ICON_GREY,
                    padding: '1px 3px',
                    borderRadius: '2px',
                    marginRight: '10px',
                  }}
                />

                <Label
                  label={timestampToShortLocal({ timestamp: parentComment.createdAt, format: 'MM/DD/YYYY LT' })}
                  fontSize={12}
                  fontWeight={600}
                />
              </div>
            </AllCommentHeader>
          )}
          <Kpi>
            <Label label={parentComment.hotel.hotelName} fontSize={14} style={{ display: 'inline-block' }} /> |
            {parentComment?.kpis.length > 0 &&
              ` ${parentComment?.kpis.map((kpi) => {
                return ` ${kpi?.kpiName || ''}`;
              })} |`}
            {parentComment?.users.length > 0 &&
              ` ${parentComment?.users.map((user) => {
                return ` ${user?.username || ''} `;
              })} | `}
          </Kpi>
          <Label
            label={`${getText('dashboard.datesInQuestion')}: ${timestampToShortLocal({
              timestamp: parentComment.startDate,
            })} - ${timestampToShortLocal({ timestamp: parentComment.endDate })}`}
          />
          {!isAllComment ? (
            <>
              <Content mt={20} />
              <Label label={parentComment.message} fontSize={16} fontWeight={600} style={{ paddingBottom: '20px' }} />
            </>
          ) : (
            <>
              <Content mt={5} />
              <Label label={parentComment.message} fontSize={16} fontWeight={600} style={{ paddingBottom: '9px' }} />
            </>
          )}
        </>
      )}
    </>
  );
});

ParentComment.displayName = 'ParentComment';

export { ParentComment };
