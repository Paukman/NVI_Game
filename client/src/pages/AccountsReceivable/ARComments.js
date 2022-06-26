import { IfPermitted } from 'components';
import dayjs from 'dayjs';
import { Button, Drawer, InputField, ToolBarItem, ToolBar, ClickAway } from 'mdo-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { footer } from 'utils/dataManipulation';
import { useARReport } from '../../graphql/useARReport';
import { getText } from '../../utils/localesHelpers';
import { ARReport } from './ARReport';
import {
  StyledCancel,
  StyledCommentAllMessage,
  StyledCommentDate,
  StyledCommentMessage,
  StyledHeader,
  StyledMessages,
  StyledProperty,
  StyledToolBarItem,
  StyledToolBarItemMessage,
  StyledCloseIcon,
  StyledHeaderWrap,
  StyledButton,
} from './styled';

const ARComments = memo((props) => {
  const { open, anchor, hotel, onClose, commentData, reportType, setCommentsOpen } = props;
  const [form, setForm] = useState(false);
  const [state, setState] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [comments, setComments] = useState(false);
  const [more, setMore] = useState(true);
  const [commentId, setCommentId] = useState('');
  const [reportData, setReportData] = useState({});
  const { hotelId, hotelName, hotelClientAccountId } = hotel || {};
  const {
    hotelARAgingCommentsList,
    hotelARAgingCommentsPost,
    postARAgingComments,
    ARAgingCommentsListLoading,
    ARAgingCommentsPostLoading,
    listARAgingComments,
    setHotelARAgingCommentsList,
    setHotelARAgingCommentsPost,
  } = useARReport();
  const commentArr = [...hotelARAgingCommentsList.data];
  const sortData = commentArr.sort((a, b) => new Date(Number(b.createdAt)) - new Date(Number(a.createdAt)));

  const data = [
    ...(hotelARAgingCommentsPost?.data.length > 0 && hotelARAgingCommentsPost?.data[0]?.id !== sortData[0]?.id
      ? hotelARAgingCommentsPost.data
      : []),
    ...sortData,
  ];

  useEffect(() => {
    listARAgingComments({
      params: {
        ...(reportType === ARReport.reportTypes.PROPERTY ? { sourceAccountName: hotelName } : { hotelId }),
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
    setReportData(commentData);
  }, [listARAgingComments, setReportData, commentData]);

  const handleChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value || '',
    };
    setDisabled(false);
    setState(newState);
  };

  const handleSubmit = () => {
    setIsSaved(true);
    setForm(false);
    setDisabled(true);
    setComments(true);

    postARAgingComments({
      params: {
        hotelId,
        message: state.message,
        //hotelClientAccountId: hotelClientAccountId || null,
        sourceAccountName: hotelName,
      },
    });

    listARAgingComments({
      params: {
        ...(reportType === ARReport.reportTypes.PROPERTY ? { sourceAccountName: hotelName } : { hotelId }),
      },
      pagination: {
        page: 1,
        pageSize: 1000,
      },
    });
  };

  const handleClickAway = () => {
    setForm(false);
    setIsSaved(false);
    setMore(true);
    setHotelARAgingCommentsList({ data: [], code: null, errors: [] });
    setHotelARAgingCommentsPost({ data: [], code: null, errors: [] });
  };

  return (
    <ClickAway onClickAway={handleClickAway}>
      <div>
        <Drawer open={open} onClose={onClose} anchor={anchor}>
          <div style={{ margin: '20px 20px 20px 20px', display: 'flex', flexDirection: 'column' }}>
            <StyledHeaderWrap>
              <div>
                <StyledHeader>Comments</StyledHeader>
              </div>
              <StyledCloseIcon>
                <Button
                  dataEl='buttonClose'
                  iconName='Close'
                  variant='tertiary'
                  onClick={() => setCommentsOpen(false)}
                />
              </StyledCloseIcon>
            </StyledHeaderWrap>
            <StyledProperty>{hotelName}</StyledProperty>
            {!form ? (
              <div>
                <StyledToolBarItemMessage>
                  <IfPermitted page='ar-comments' permissionType='create'>
                    <Button
                      iconName='Add'
                      variant='tertiary'
                      title={getText('generic.add')}
                      alt='buttonCreateComment'
                      onClick={() => {
                        setForm(true);
                        setIsSaved(false);
                        setComments(false);
                        setState({ ...state, message: '' });
                      }}
                      dataEl='buttonAdd'
                    />
                  </IfPermitted>
                  <StyledButton
                    onClick={() => {
                      setForm(true);
                      setIsSaved(false);
                      setComments(false);
                      setState({ ...state, message: '' });
                    }}
                  >
                    <StyledMessages>Comment</StyledMessages>
                  </StyledButton>
                </StyledToolBarItemMessage>
                <StyledToolBarItem>
                  {hotelARAgingCommentsList &&
                    data.map((comment) => (
                      <Fragment key={comment.id}>
                        <StyledCommentDate>
                          by {comment?.userCreated?.displayName}{' '}
                          {dayjs(Number(comment?.createdAt)).format('YYYY-MM-DD HH:mm A')}
                        </StyledCommentDate>
                        {more || comment.id !== commentId ? (
                          <StyledCommentMessage
                            onClick={() => {
                              setMore(false);
                              setCommentId(comment.id);
                            }}
                          >
                            {comment?.message}
                          </StyledCommentMessage>
                        ) : (
                          <StyledCommentAllMessage>{comment?.message}</StyledCommentAllMessage>
                        )}
                      </Fragment>
                    ))}
                </StyledToolBarItem>
              </div>
            ) : (
              <div>
                <form>
                  <InputField
                    name='message'
                    value={state.message || ''}
                    onChange={handleChange}
                    label={getText('generic.addComment')}
                    //error={!!errors['comment']}
                    //helperText={errors['comment']}
                    multiline
                    required
                  />
                </form>

                <StyledCancel>
                  <Button
                    variant='default'
                    iconName='Block'
                    text={getText('generic.cancel')}
                    onClick={() => {
                      setForm(false);
                      setIsSaved(false);
                    }}
                  />

                  <Button
                    variant='primary'
                    iconName='Check'
                    text={getText('generic.save')}
                    disabled={disabled}
                    onClick={handleSubmit}
                  />
                </StyledCancel>
              </div>
            )}
          </div>
        </Drawer>
      </div>
    </ClickAway>
  );
});

ARComments.displayName = 'ARComments';

ARComments.propTypes = {
  open: PropTypes.bool,
  anchor: PropTypes.oneOf(Drawer.anchors),
  hotel: PropTypes.any,
  reportType: PropTypes.string,
  onClose: PropTypes.func,
  data: PropTypes.array,
  commentData: PropTypes.any,
  setCommentsOpen: PropTypes.func,
};

ARComments.defaultProps = {
  open: false,
  anchor: 'right',
};

export { ARComments };
