import gql from 'graphql-tag';

const INCOME_JOURNAL_EXPORT_GET = gql`
  query ($params: IncomeJournalExportInput) {
    incomeJournalExportGet(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        startDate
        endDate
        firstRowIsHeader
        columnsCfg {
          name
          columnDataIdx
        }
        items {
          columnsData {
            value
          }
        }
      }
    }
  }
`;

const INCOME_JOURNAL_SYNC_AVAILABILITY = gql`
  query ($params: IncomeJournalSyncAvailabilityInput) {
    incomeJournalSyncAvailability(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        isEnabled
      }
    }
  }
`;

const INCOME_JOURNAL_SYNC = gql`
  query ($params: IncomeJournalSyncInput) {
    incomeJournalSync(params: $params) {
      code
      errors {
        name
        messages
      }
      data {
        hotelId
        period
        date
        taskId
        filename
        numberOfRows
        exportType
      }
    }
  }
`;

const incomeJournalExportQuery = {
  get: INCOME_JOURNAL_EXPORT_GET,
  syncAvailability: INCOME_JOURNAL_SYNC_AVAILABILITY,
  sync: INCOME_JOURNAL_SYNC,
};

export { incomeJournalExportQuery };
