import { LinkActions } from 'mdo-react-components';
import React from 'react';
import { getText } from '../../utils/localesHelpers';
import { CellRenderer } from '../ProfitAndLoss/CellRenderer';
import { localColors } from '../../config/colors';
import { colors } from 'mdo-react-components';
import { ARReport } from './ARReport';
import { VALUE_TYPES } from 'config/constants';
import { StyledLink } from './styled';

export const values = [
  {
    field: 'due030',
    location: 'ar-aging',
    headerName: getText('arAging.thirtyDays'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.lightGray,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
  {
    field: 'due3160',
    location: 'ar-aging',
    headerName: getText('arAging.sixtyDays'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.white,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
  {
    field: 'due6190',
    location: 'ar-aging',
    headerName: getText('arAging.ninetyDays'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.lightGray,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
  {
    field: 'due91120',
    location: 'ar-aging',
    headerName: getText('arAging.hundredDays'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.white,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
  {
    field: 'dueOver120',
    location: 'ar-aging',
    headerName: getText('arAging.hundredPlusDays'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.lightGray,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
  {
    field: 'total',
    location: 'ar-aging',
    headerName: getText('arAging.totalAR'),
    width: 120,
    align: 'right',
    headerAlign: 'left',
    bgColor: true,
    background: colors.white,
    valueType: VALUE_TYPES.CURRENCY,
    onRender: CellRenderer,
    sortable: true,
    maxColor: localColors.LIGHT_RED,
    mediumColor: localColors.LIGHT_YELLOW,
  },
];

export const columnsConfig = (args) => {
  const { setCommentsOpen, setDataHotelId, reportType, setLink } = args;
  const columns = [];

  if (reportType === ARReport.reportTypes.PROPERTY) {
    columns.push({
      field: 'accountName',
      headerName: getText('arAging.accountName'),
      width: 150,
      align: 'left',
      sortable: true,
      onRender: ({ dataRow }) => {
        const { hotelClientAccount, sourceAccountName } = dataRow || {};
        const { accountName } = hotelClientAccount || {};
        return sourceAccountName || accountName;
      },
    });
  }

  return columns.concat([
    {
      field: reportType === ARReport.reportTypes.PROPERTY ? 'mappedTo' : 'property',
      headerName:
        reportType === ARReport.reportTypes.PROPERTY ? getText('arAging.mappedTo') : getText('arAging.property'),
      align: 'left',
      width: 150,
      //color: colors.blue,
      sortable: true,
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        // eslint-disable-next-line
        const { hotel, hotelId, hotelClientAccount, sourceAccountName, hotelClientAccountId } = dataRow || {};
        const { hotelName } = hotel || {};
        const { accountName } = hotelClientAccount || {};
        return (
          <StyledLink>
            <LinkActions
              hasFont
              items={[
                {
                  clickId: 'comments',
                  // eslint-disable-next-line
                  text:
                    (reportType === ARReport.reportTypes.DASHBOARD || reportType === ARReport.reportTypes.ACCOUNT
                      ? // eslint-disable-next-line
                        hotelName
                      : // eslint-disable-next-line
                      reportType === ARReport.reportTypes.PROPERTY &&
                        (hotelClientAccount === 'Totals' || accountName === 'Totals')
                      ? ''
                      : hotelClientAccount && accountName) || '',
                  variant: 'tertiary',
                  // eslint-disable-next-line
                  ...((reportType === ARReport.reportTypes.DASHBOARD || reportType === ARReport.reportTypes.ACCOUNT
                    ? // eslint-disable-next-line
                      hotelName
                    : // eslint-disable-next-line
                      hotelClientAccount && accountName) !== getText('arAging.totals')
                    ? {
                        color: colors.blue,
                        textDecoration: 'underline',
                      }
                    : { color: colors.black, textDecoration: 'none' }),
                },
              ]} // eslint-disable-next-line
              onClick={() => {
                // eslint-disable-next-line
                if (reportType === ARReport.reportTypes.DASHBOARD || reportType === ARReport.reportTypes.ACCOUNT) {
                  setDataHotelId({
                    // eslint-disable-next-line
                    hotelId,
                    // eslint-disable-next-line
                    hotelName,
                  });
                  // eslint-disable-next-line
                  hotelId && hotelName && hotelName !== getText('arAging.totals') && setLink(true);
                } else {
                  setDataHotelId({
                    // eslint-disable-next-line
                    hotelClientAccountId,
                    // eslint-disable-next-line
                    accountName: accountName || sourceAccountName,
                  });
                  // eslint-disable-next-line
                  ((hotelClientAccount && accountName) || sourceAccountName) &&
                    accountName !== getText('arAging.totals') &&
                    setLink(true);
                }
              }}
            />
          </StyledLink>
        );
      },
    },
    ...values,
    {
      field: '',
      headerName: getText(''),
      align: 'left',
      width: 20,
      background: colors.white,
      // eslint-disable-next-line
      onRender: ({ dataRow }) => {
        const { hotel, hotelId, hotelClientAccount, sourceAccountName, hotelClientAccountId, latestComment } =
          dataRow || {};
        const { hotelName, id } = hotel || {};
        const { accountName } = hotelClientAccount || {};
        const { hotelId: latestCommentHotelId } = latestComment || {};

        return (
          !(hotelName === 'Totals' || accountName === 'Totals') && (
            <LinkActions
              items={[
                {
                  clickId: 'comments',
                  variant: 'tertiary',
                  iconName: 'Comment',
                  text: '',
                },
              ]}
              onClick={() => {
                // eslint-disable-next-line
                if (reportType === ARReport.reportTypes.DASHBOARD || reportType === ARReport.reportTypes.ACCOUNT) {
                  setDataHotelId({
                    // eslint-disable-next-line
                    hotelId,
                    // eslint-disable-next-line
                    hotelName,
                  });
                  setCommentsOpen(true);
                } else if (
                  // eslint-disable-next-line
                  ((hotelClientAccount && accountName) || sourceAccountName) &&
                  accountName !== getText('arAging.totals')
                ) {
                  setDataHotelId({
                    // eslint-disable-next-line
                    hotelId: latestCommentHotelId,
                    // eslint-disable-next-line
                    hotelClientAccountId,
                    // eslint-disable-next-line
                    hotelName: accountName || sourceAccountName,
                  });
                  setCommentsOpen(true);
                }
              }}
            />
          )
        );
      },
    },
  ]);
};
