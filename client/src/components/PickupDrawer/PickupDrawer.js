import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Subsettings } from './Subsettings';
import { SettingsSubTopic, Container } from './styled';
const PickupDrawer = memo((props) => {
  const { data, onApply, visibility } = props;

  const content = [];

  const handleChange = (newValue) => {
    if (typeof onApply !== 'function') {
      return;
    }

    onApply(newValue);
  };
  data.forEach((setting) => { 
    content.push(
      <Container>
        <SettingsSubTopic>{setting.title}</SettingsSubTopic>
        <Subsettings
          data={setting.subColumns}
          onApply={handleChange}
          visibilityValue={visibility}
          disabled={setting.title == 'Totals'}
        />
      </Container>,
    );
  });
  return content;
});

PickupDrawer.displayName = 'PickupDrawer';

PickupDrawer.propTypes = {
  onApply: PropTypes.func,
};

export { PickupDrawer };
