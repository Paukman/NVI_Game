import React from 'react';
import { InputField } from 'mdo-react-components';

export const ManualEntryConstants = (args) => {
  const { onValueChange } = args;
  return [
    {
      field: '',
      headerName: 'Display Name',
      headerAlign: 'center',
      align: 'left',
      width: 200,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => e?.dataRow?.reportSetting?.displayName ?? '',
    },
    {
      field: 'jan',
      headerName: 'Jan',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.jan}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('jan', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'feb',
      headerName: 'Feb',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.feb}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('feb', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'mar',
      headerName: 'Mar',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.mar}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('mar', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'apr',
      headerName: 'Apr',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.apr}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('apr', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'may',
      headerName: 'may',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.may}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('may', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'jun',
      headerName: 'Jun',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.jun}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('jun', b, e?.dataRow?.id);
          }}
        />
      ),
    },

    {
      field: 'jul',
      headerName: 'Jul',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.jul}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('jul', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'aug',
      headerName: 'Aug',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.aug}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('aug', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'sep',
      headerName: 'Sep',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.sep}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('sep', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'oct',
      headerName: 'Oct',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.oct}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('oct', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'nov',
      headerName: 'Nov',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.nov}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('nov', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'dec',
      headerName: 'Dec',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.dec}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('dec', b, e?.dataRow?.id);
          }}
        />
      ),
    },
    {
      field: 'total',
      headerName: 'Year Input',
      headerAlign: 'center',
      align: 'right',
      width: 50,
      color: '#3b6cb4',
      // eslint-disable-next-line
      onRender: (e) => (
        <InputField
          type='number'
          value={e?.dataRow?.total}
          inputProps={{ style: { fontSize: '12px', fontWeight: '400' } }}
          onChange={(a, b, c) => {
            onValueChange('total', b, e?.dataRow?.id);
          }}
        />
      ),
    },
  ];
};
