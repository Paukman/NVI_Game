import React, { memo } from 'react';
import { Checkbox, colors } from 'mdo-react-components';

import { SettingsSubTopic } from '../styled';

const HealthScorecardEditDrawer = memo((props) => {
  const { data, onChange } = props;

  if (!Array.isArray(data) || !data.length) {
    return null;
  }

  return data.map((item, index) => {
    return (
      <div key={index}>
        {item.type === 'group' && <SettingsSubTopic>{item.name}</SettingsSubTopic>}
        {item.type === 'item' && (
          <Checkbox
            label={item.name}
            name={item.settingCode}
            id={index}
            onChange={onChange}
            checked={item.userSettingValue}
            checkedColor={colors.blue}
            checkboxSize={'scale(1.3)'}
            withLeftMargin={true}
          />
        )}
      </div>
    );
  });
});

HealthScorecardEditDrawer.displayName = 'HealthScorecardEditDrawer';

export { HealthScorecardEditDrawer };
