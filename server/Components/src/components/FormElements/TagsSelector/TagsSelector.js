import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Chip } from '../../Chip';
import { FormHelperText } from '@material-ui/core';
import { Label } from '../Label';
import { Content } from '../Content';

import { Container, Chips } from './styled';
import { mapArrayBy } from '../../../utils/formatters';
import { handleInputChange, buildAttributes } from '../../../utils/formHelpers';

const TagsSelector = memo((props) => {
  const {
    value,
    items,
    onClick,
    errorMsg,
    itemLabelName,
    itemValueName,
    label,
    tagSize,
    tagVariant,
    tagColor,
    dataEl,
  } = props;

  if (!Array.isArray(value) && value != null) {
    console.warn(`The 'TagSelector' components expects 'value' prop to be an array or null/undefined but got`, value);
    value = [];
  }

  if (!Array.isArray(items) && value != null) {
    console.warn(`The 'TagSelector' components expects 'items' prop to be an array but got`, value);
    items = [];
  }

  const mapItems = mapArrayBy(items, itemValueName);

  const chips = value.map((chipValue) => {
    const item = mapItems[chipValue] || { [itemLabelName]: chipValue, [itemValueName]: chipValue };
    const chipLabel = item[itemLabelName];

    return (
      <Chip
        key={chipValue}
        label={chipLabel}
        size={tagSize}
        variant={tagVariant}
        color={tagColor}
        dataEl={`${dataEl}-${chipValue}`}
        onDelete={() => {
          handleInputChange(props)({ target: { value: value.filter((item) => item !== chipValue) } });
        }}
        onClick={() => {
          if (typeof onClick === 'function') {
            onClick(item);
          }
        }}
      />
    );
  });

  return (
    <Container {...buildAttributes(props, ['id', 'dataEl'])}>
      {label && (
        <Content mb={5}>
          <Label label={label} dataEl={`${dataEl}-label`} />
        </Content>
      )}
      <Chips data-el={`${dataEl}-tags`}>{chips}</Chips>
      {errorMsg && (
        <FormHelperText error data-el={`${dataEl}-error`}>
          {errorMsg}
        </FormHelperText>
      )}
    </Container>
  );
});

TagsSelector.displayName = 'TagsSelector';

TagsSelector.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.stirng,
  value: PropTypes.arrayOf(PropTypes.shape({})),
  items: PropTypes.arrayOf(PropTypes.shape({})),
  itemLabelName: PropTypes.string,
  itemValueName: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  errorMsg: PropTypes.string,
  tagSize: PropTypes.oneOf(Chip.sizes),
  tagVariant: PropTypes.oneOf(Chip.variants),
  tagColor: PropTypes.oneOf(Chip.colors),
  dataEl: PropTypes.string,
};

TagsSelector.defaultProps = {
  itemLabelName: 'label',
  itemValueName: 'value',
};

export { TagsSelector };
