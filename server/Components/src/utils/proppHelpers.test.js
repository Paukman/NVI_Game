import { getSizeInPx } from './propHelpers';

describe('Testing getSizeInPx', () => {
  it('should return proper value on input', () => {
    let res = getSizeInPx(10);
    expect(res).toEqual('10px');

    res = getSizeInPx(null);
    expect(res).toEqual(null);

    res = getSizeInPx(undefined);
    expect(res).toEqual(null);

    res = getSizeInPx('garbage');
    expect(res).toEqual(null);

    res = getSizeInPx(10.0);
    expect(res).toEqual('10px');

    res = getSizeInPx('20px');
    expect(res).toEqual('20px');
  });
});
