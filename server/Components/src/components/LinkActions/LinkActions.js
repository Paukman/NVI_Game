import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Span, A, Wrap, IconWrap, LinkLabel } from './styled';
import Icon from '../Icon/Icon';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

const LinkActions = memo((props) => {
  const { hasFont, disabled, onClick, noPadding = false, items, dataEl } = props;

  const handleClick = (event, item) => {
    event.preventDefault();
    if (typeof onClick === 'function') {
      onClick(item, event);
    }
  };

  return (
    <Span>
      {items.map((item, key) => {
        let iconAlign = item.iconAlign ?? 'left';
        return (
          <Wrap key={key}>
            <A
              href={`${item.href || `#${item.text}`}`}
              disabled={disabled}
              onClick={(event) => handleClick(event, item)}
              noPadding={noPadding}
            >
              {iconAlign === 'left' && (
                <IconWrap iconAlign={iconAlign} marginLeft={item.marginLeft} marginRight={item.marginRight}>
                  {item.iconName && (
                    <Icon
                      name={item.iconName}
                      size={item.iconSize || 15}
                      color={item.iconColor}
                      data-el={item.dataEl}
                    />
                  )}
                </IconWrap>
              )}
              <LinkLabel
                linkLabelFont={
                  hasFont
                    ? {
                        color: item.color,
                        textDecoration: item.textDecoration,
                        fontSize: item.fontSize,
                        lineHeight: item.lineHeight,
                        fontWeight: item.fontWeight,
                      }
                    : {
                        color: colors.black,
                        textDecoration: 'none',
                        fontSize: '12px',
                        lineHeight: 'inherit',
                        fontWeight: 'normal',
                      }
                }
                data-el={dataEl ?? `linkActions${item.text}`}
              >
                {item.text}
              </LinkLabel>
              {iconAlign === 'right' && (
                <IconWrap iconAlign={iconAlign}>
                  {item.iconName && <Icon name={item.iconName} size={item.iconSize || 15} color={item.iconColor} />}
                </IconWrap>
              )}
            </A>
          </Wrap>
        );
      })}
    </Span>
  );
});

LinkActions.displayName = 'LinkActions';

LinkActions.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  linkLabelFont: PropTypes.object,
  hasFont: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      iconName: PropTypes.string,
      iconAlign: PropTypes.string,
      fontSize: PropTypes.string,
      lineHeight: PropTypes.string,
      iconSize: PropTypes.number,
      iconColor: PropTypes.string,
      marginLeft: PropTypes.number,
      marginRight: PropTypes.number,
    }),
  ),
  noPadding: PropTypes.bool,
  dataEl: PropTypes.string,
};

LinkActions.defaultProps = {
  disabled: false,
  noPadding: false,
};

export { LinkActions };
