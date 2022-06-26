import React, { memo, Fragment, useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, ToolBar, ToolBarItem, Toggle, InputDate, ButtonDownloadAs, Search } from 'mdo-react-components';

import { getText, search } from '../../utils/localesHelpers';
import { buildDownloadData } from '../../utils/downloadHelpers';
import { GlobalFilterContext, HotelContext, AppContext } from '../../contexts';
import { PmsTypesProvider } from '../../providers';
import { HmgGlCodeProvider } from '../../providers';

import { HotelSelector, DataLoading, DisplayApiErrors, DisplayNoData, IJPeriodSelector } from '../../components';

import { IncomeJournalMapping } from './IncomeJournalMapping';
import { IncomeJournalSummary } from './IncomeJournalSummary';

import { useIncomeJournal } from '../../graphql/useIncomeJournal';
import logger from '../../utils/logger';
import { CSVLink } from 'react-csv';
import { downloadHeaders } from './downloadHelpers';

const DISPLAY_MODES = {
  MAPPING: 0,
  SUMMARY: 1,
};

let date = null;
let period = null;

const IncomeJournal = memo(() => {
  const history = useHistory();
  const { appPages } = useContext(AppContext);

  if (history.location.pathname === appPages.keys['ij-mapping'].url) {
    return (
      <PmsTypesProvider>
        <HmgGlCodeProvider>
          <IncomeJournalMapping
            dateChange={(e) => (date = e)}
            periodChange={(e) => (period = e)}
            date={date}
            period={period}
          />
        </HmgGlCodeProvider>
      </PmsTypesProvider>
    );
  } else if (history.location.pathname === appPages.keys['ij-summary'].url) {
    return (
      <PmsTypesProvider>
        <HmgGlCodeProvider>
          <IncomeJournalSummary
            dateChange={(e) => (date = e)}
            periodChange={(e) => (period = e)}
            date={date}
            period={period}
          />
        </HmgGlCodeProvider>
      </PmsTypesProvider>
    );
  }

  return <DisplayNoData />;
});

IncomeJournal.displayName = 'IncomeJournal';

export { IncomeJournal };
