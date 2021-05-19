import BigNumber from 'bignumber.js';

export interface Money {
  readonly amount: BigNumber;
}

export const createMoney = (amount: number | string | BigNumber): Money => ({
  amount: new BigNumber(amount),
});

export const zero = () => createMoney(0);

export const sumMoney = (first: Money, second: Money): Money =>
  createMoney(first.amount.plus(second.amount));

export const negateMoney = (money: Money): Money =>
  createMoney(money.amount.negated());

export const subtractMoney = (first: Money, second: Money): Money =>
  sumMoney(first, negateMoney(second));

export const isPositiveOrZero = (money: Money): boolean =>
  money.amount.comparedTo(0) >= 0;
