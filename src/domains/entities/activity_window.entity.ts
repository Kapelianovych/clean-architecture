import { fork } from '@fluss/core';

import { Activity } from './activity.entity';
import { AccountId } from './account.entity';
import { Money, subtractMoney, sumMoney, zero } from './money.entity';

export interface ActivityWindow {
  readonly activities: ReadonlyArray<Activity>;
}

export const createActivityWindow = (
  activities: ReadonlyArray<Activity> = []
): ActivityWindow => ({ activities });

export const addActivityToWindow = (
  window: ActivityWindow,
  activity: Activity
): ActivityWindow => createActivityWindow(window.activities.concat(activity));

const sumMoneyWith =
  (predicate: (activity: Activity) => boolean) =>
  (window: ActivityWindow): Money =>
    window.activities
      .filter(predicate)
      .map((activity) => activity.money)
      .reduce(sumMoney, zero());

const calculateDepositBalance = (
  window: ActivityWindow,
  accountId: AccountId
): Money =>
  sumMoneyWith((activity) => activity.targetAccountId === accountId)(window);

const calculateWithdrawalBalance = (
  window: ActivityWindow,
  accountId: AccountId
): Money =>
  sumMoneyWith((activity) => activity.sourceAccountId === accountId)(window);

export const calculateBalance = fork(
  subtractMoney,
  calculateDepositBalance,
  calculateWithdrawalBalance
);
