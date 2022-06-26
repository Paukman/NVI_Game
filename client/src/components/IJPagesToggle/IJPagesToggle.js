import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Toggle } from 'mdo-react-components';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';

const IJPagesToggle = memo((props) => {
  const { displayMode, dataEls, buttonLabels } = props;
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  const toggleContent = useMemo(() => {
    return [];
  }, []);

  useEffect(() => {
    if (Array.isArray(buttonLabels) && Array.isArray(dataEls)) {
      buttonLabels.forEach((val, key) => {
        toggleContent.push(<div data-el={dataEls[key]}>{val}</div>);
      });
    }
    return;
  }, [dataEls, buttonLabels, toggleContent]);

  return (
    <Toggle
      value={displayMode}
      onChange={(item) => {
        if (item === 0) {
          history.push(appPages.keys['ij-mapping'].url);
        }
        if (item === 1) {
          history.push(appPages.keys['ij-summary'].url);
        }
        if (item === 2) {
          history.push(appPages.keys['ij-reconciliation'].url);
        }
      }}
      dataEl='toggleILPages'
    >
      {toggleContent}
    </Toggle>
  );
});

IJPagesToggle.displayName = 'IJPagesToggle';

IJPagesToggle.propTypes = {
  displayMode: PropTypes.number,
  dataEls: PropTypes.array,
  buttonLabels: PropTypes.array,
};

IJPagesToggle.defaultProps = {
  dataEls: ['buttonMapping', 'buttonSummary', 'buttonReconciliation'],
  buttonLabels: [
    getText('incomeJournal.mapping'),
    getText('incomeJournal.summary'),
    getText('incomeJournal.reconciliation'),
  ],
};

export { IJPagesToggle };
