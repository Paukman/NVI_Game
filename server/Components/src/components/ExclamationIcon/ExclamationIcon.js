import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Wrapper, TitleWrapper, ItemWrapper, useStyles } from './styled';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const ExclamationIcon = memo((props) => {
  const { data, title } = props;
  const classes = useStyles();

  return (
    <Tooltip
      classes={classes}
      title={
        <Wrapper>
          <TitleWrapper>{title}</TitleWrapper>
          {data.map((item, index) => {
            return <ItemWrapper key={index}>{item}</ItemWrapper>;
          })}
        </Wrapper>
      }
      arrow
      placement='bottom'
    >
      <Wrapper>
        <Icon name='Error' color={colors.red} size={25} />
      </Wrapper>
    </Tooltip>
  );
});

ExclamationIcon.displayName = 'ExclamationIcon';

ExclamationIcon.propTypes = {
  title: PropTypes.String,
  data: PropTypes.arrayOf(String),
};

export { ExclamationIcon };
