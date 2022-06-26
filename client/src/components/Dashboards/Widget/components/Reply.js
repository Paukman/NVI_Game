import React, { useState } from 'react';
import { getText, timestampToShortLocal } from 'utils';
import { Icon, colors, Label } from 'mdo-react-components';

import { ReplyHeader, ReplyContent, ReplyBody, LineBetweenReply } from '../styled';

const Reply = (props) => {
  const { username, createdAt, message, index, open, color } = props;
  const [isReadMore, setIsReadMore] = useState(true);
  let readMore = message.length > 150;

  const downButton = (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {getText('generic.showMore')}
      <Icon name='ArrowDropDown' size={20} />
    </span>
  );

  const upButton = (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {getText('generic.showLess')}
      <Icon name='ArrowDropUp' size={20} />
    </span>
  );

  return (
    <ReplyContent key={index}>
      <ReplyHeader style={{ paddingBottom: '7px' }}>
        <Label label={username} fontSize={14} fontWeight={600} color={colors.darkBlue} />
        <span>
          {index === 0 && open ? `(${getText('generic.mostRecent')})` : ''}&nbsp;&nbsp;{' '}
          {timestampToShortLocal({ timestamp: createdAt, format: 'MM/DD/YYYY LT' })}
        </span>
      </ReplyHeader>
      <ReplyBody style={{ color, wordBreak: 'break-word' }}>
        {readMore && isReadMore ? `${message.slice(0, 150)}...` : message}
        <span
          onClick={() => setIsReadMore((isReadMore) => !isReadMore)}
          style={{
            float: 'right',
            cursor: 'pointer',
            color: colors.darkBlue,
            fontSize: '14px',
          }}
        >
          {readMore ? (isReadMore ? downButton : upButton) : ''}
        </span>
      </ReplyBody>
      {open && <LineBetweenReply />}
    </ReplyContent>
  );
};

Reply.displayName = 'Reply';

export { Reply };
