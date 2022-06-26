import { validateDates, prepareParamsForPurchseOrderCreate, getTotals } from './utils';
import dayjs from 'dayjs';

describe('Testing validateDates', () => {
  it('should return same errors if garbage passed in', () => {
    let res = validateDates({
      name: 'FreddyMercury',
      deliverBy: 'garbage',
      date: '2021-08-12T16:01:38.830Z',
      errors: { someError: 'big error' },
    });
    expect(res).toEqual({ updatedErrors: { someError: 'big error' } });
    res = validateDates({
      name: 'FreddyMercury',
      date: '2021-08-12T16:01:38.830Z',
      errors: { someError: 'big error' },
    });
    expect(res).toEqual({ updatedErrors: { someError: 'big error' } });
  });
  it('should not return error on same dates', () => {
    const res = validateDates({
      name: 'FreddyMercury',
      deliverBy: '2021-08-13T16:01:38.830Z',
      date: '2021-08-13T16:01:38.830Z',
      errors: {},
    });
    expect(res).toEqual({ updatedErrors: {} });
  });
  it('should not return error on po date before required by date', () => {
    const res = validateDates({
      name: 'FreddyMercury',
      deliverBy: '2021-08-13T16:01:38.830Z',
      date: '2021-08-12T16:01:38.830Z',
      errors: {},
    });
    expect(res).toEqual({ updatedErrors: {} });
  });

  it('should keep existing errors', () => {
    const res = validateDates({
      name: 'FreddyMercury',
      deliverBy: '2021-08-13T16:01:38.830Z',
      date: '2021-08-12T16:01:38.830Z',
      errors: { someError: 'big error' },
    });
    expect(res).toEqual({ updatedErrors: { someError: 'big error' } });
  });

  it('should return error when po date is after required by date', () => {
    const res = validateDates({
      name: 'FreddyMercury',
      deliverBy: '2021-08-13T16:01:38.830Z',
      date: '2021-08-14T16:01:38.830Z',
      errors: { someError: 'big error' },
    });
    expect(res).toEqual({
      updatedErrors: { someError: 'big error', FreddyMercury: 'Delivery date must be after PO date' },
    });
  });
});

describe('Testing prepareParamsForPurchseOrderCreate', () => {
  it('should return proper data', () => {
    const testData = {
      comment: 'qa',
      date: '08/26/2021',
      departmentId: null,
      fob: 'qa',
      hotelId: 1060,
      poNumber: '20210826-16-14290',
      poTypeId: 3,
      purchaseOrderItems: null,
      requiredBy: '08/26/2021',
      shipToAddressId: '9d71b0fe-b851-4bc9-84ce-7bc0fb6cbc70',
      shipToAttention: 'Sergey',
      shipVia: '',
      shippingAmount: 200,
      subtotal: '2,700.00',
      taxAmount: '81.00',
      taxPercentage: 3,
      terms: '',
      vendorAddressId: '5d3b9da7-1f0d-4103-970d-e70b28091ded',
      vendorId: 'ce99b265-a593-45ce-b486-d7c6d3e9f581',
      vendorToAttention: 'Daily Person',
    };

    let res = prepareParamsForPurchseOrderCreate(testData);
    expect(res).toEqual({
      comment: 'qa',
      date: dayjs('08/26/2021'),
      departmentId: undefined,
      fob: 'qa',
      hotelId: 1060,
      poTypeId: 3,
      purchaseOrderItems: undefined,
      requiredBy: dayjs('08/26/2021'),
      shipToAddressId: '9d71b0fe-b851-4bc9-84ce-7bc0fb6cbc70',
      shipToAttention: 'Sergey',
      shipVia: '',
      shippingAmount: 200,
      subtotal: 2700,
      taxAmount: 81,
      taxPercentage: 3,
      terms: '',
      vendorAddressId: '5d3b9da7-1f0d-4103-970d-e70b28091ded',
      vendorId: 'ce99b265-a593-45ce-b486-d7c6d3e9f581',
      vendorToAttention: 'Daily Person',
    });

    res = prepareParamsForPurchseOrderCreate({
      ...testData,
      subtotal: '2,702.34',
      taxAmount: '8,100.00',
    });
    expect(res).toEqual(
      expect.objectContaining({
        subtotal: 2702.34,
        taxAmount: 8100,
      }),
    );

    // will remove po items with only id's
    res = prepareParamsForPurchseOrderCreate({
      ...testData,
      purchaseOrderItems: [{ id: '1', itemNumber: '123' }, { id: '2' }, { id: '3' }],
    });
    expect(res).toEqual(expect.objectContaining({ purchaseOrderItems: [{ itemNumber: '123' }] }));
  });
});

describe('Testing getTotals', () => {
  it('should return proper totals on arguments', () => {
    const purchaseOrderItems = [{ total: '10' }, { total: 20 }];

    let res = getTotals({ purchaseOrderItems, taxPercentage: 100, shippingAmount: 70, taxAmount: 100 });
    expect(res).toEqual({
      subtotal: '30.00',
      taxAmount: '100.00',
      total: '200.00',
    });
    // no tax rate, ignore tax amount
    res = getTotals({ purchaseOrderItems, shippingAmount: 70, taxAmount: 100 });
    expect(res).toEqual({
      subtotal: '30.00',
      taxAmount: null,
      total: '100.00',
    });

    res = getTotals({ purchaseOrderItems, taxPercentage: 10, taxAmount: 100 });
    expect(res).toEqual({
      subtotal: '30.00',
      taxAmount: '3.00',
      total: '33.00',
    });
  });
});
