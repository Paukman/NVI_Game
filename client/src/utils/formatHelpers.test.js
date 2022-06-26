import { timestampToShortLocal } from './formatHelpers';

describe('Testing timestampToShortLocal', () => {
  it('should return proper date for timestamp', () => {
    let res = timestampToShortLocal({ timestamp: '1621234567890', utc: true });
    expect(res).toEqual('05/17/2021');

    res = timestampToShortLocal({ timestamp: 1621234567890, utc: true });
    expect(res).toEqual('05/17/2021');

    res = timestampToShortLocal({ timestamp: 1234567890, utc: true });
    expect(res).toEqual('01/15/1970');

    res = timestampToShortLocal({ timestamp: '0001234567890', utc: true });
    expect(res).toEqual('01/15/1970');

    // this is still valid date
    res = timestampToShortLocal({ timestamp: '010101010101', utc: true });
    expect(res).toEqual('01/01/101');

    res = timestampToShortLocal({ timestamp: 'Aug. 15. 2021', utc: true });
    expect(res).toEqual('08/15/2021');
  });
  it('should return null for not valid date', () => {
    let res = timestampToShortLocal({ timestamp: 'garbage', utc: true });
    expect(res).toEqual('garbage');

    res = timestampToShortLocal(undefined);
    expect(res).toEqual('');

    res = timestampToShortLocal(null);
    expect(res).toEqual('');

    res = timestampToShortLocal('');
    expect(res).toEqual('');
  });
});
