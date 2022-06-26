import React, { memo, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../../utils/localesHelpers';
import { Dropdown } from 'mdo-react-components';
import { useWidget } from '../../../graphql';

const WidgetDropdown = memo((props) => {
  const { widgets, widgetList, widgetsLoading } = useWidget();

  useEffect(() => {
    widgetList({ params: {} });
  }, [widgetList]);

  const items = [];

  if (widgetsLoading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    items.push(
      ...widgets.data.map((widget) => {
        return {
          label: widget.widgetName,
          value: widget.id,
        };
      }),
    );
  }

  return <Dropdown items={items} {...props} />;
});

WidgetDropdown.displayName = 'WidgetDropdown';

WidgetDropdown.propTypes = {
  ...Dropdown.propTypes,
};

export { WidgetDropdown };
