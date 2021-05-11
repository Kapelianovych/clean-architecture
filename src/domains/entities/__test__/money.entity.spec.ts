import {
  sumMoney,
  createMoney,
  negateMoney,
  subtractMoney,
  isPositiveOrZero,
} from '../money.entity';

describe('money entity', () => {
  it('should sum money', () => {
    const result = sumMoney(createMoney(1), createMoney(2));

    expect(result).toEqual(createMoney(3));
  });

  it('should negate money', () => {
    const result = negateMoney(createMoney(1));

    expect(result).toEqual(createMoney(-1));
  });

  it('should subtract money', () => {
    const result = subtractMoney(createMoney(3), createMoney(1));

    expect(result).toEqual(createMoney(2));
  });

  it('should return true if amount of money is greater then zero', () => {
    expect(isPositiveOrZero(createMoney(1))).toBe(true);
  });

  it('should return true if amount of money is zero', () => {
    expect(isPositiveOrZero(createMoney(0))).toBe(true);
  });

  it('should return false if amount of money is lower then zero', () => {
    expect(isPositiveOrZero(createMoney(-6))).toBe(false);
  });
});
