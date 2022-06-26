import React, { memo, useState, useMemo } from 'react';
import { Checkbox, ToolBarItem, colors } from 'mdo-react-components';

const Subsettings = memo((props) => {
  const { data, onApply, visibilityValue, disabled } = props;
  const content = [];
  const [state, setState] = useState({});

  useMemo(() => {
    //Format the structure of the state value eg   const [active, setActive] = useState({'displayColumnTotalRevenue': true,'displayColumnOccupancyRoomsSold':false});
    const visibility = visibilityValue.reduce((acc, item) => {
      const { settingCode, userSettingValue } = item || {};
      return { ...acc, ...{ [settingCode]: userSettingValue } };
    }, {});
    setState(visibility);
  }, [visibilityValue]);

  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value,
    });

    onApply([{ settingCode: name, userSettingValue: value.toString() }]);
  };

  if (data && data.length !== 0) {
    data.forEach((setting) => {
      content.push(
        <ToolBarItem style={{ padding: 0 }}>
          <Checkbox
            label={setting.subTitle}
            id={setting.settingCode}
            onChange={handleChange}
            checked={state[setting?.settingCode] === true || state[setting?.settingCode] === 'true'}
            checkedColor={colors.lightGreen2}
            checkboxSize={'scale(1.3)'}
            withLeftMargin={true}
            disabled={disabled}
          />
        </ToolBarItem>,
      );
    });
  }

  return content;
});

Subsettings.displayName = 'Subsettings';

export { Subsettings };
