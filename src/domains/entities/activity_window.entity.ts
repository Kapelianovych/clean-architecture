import { AccountId } from './account.entity';

import { Activity } from './activity.entity';
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

export const calculateBalance = (
  window: ActivityWindow,
  accountId: AccountId
): Money => {
  const depositBalance = window.activities
    .filter((activity) => activity.targetAccountId === accountId)
    .map((activity) => activity.money)
    .reduce(sumMoney, zero());

  const withdrawalBalance = window.activities
    .filter((activity) => activity.sourceAccountId === accountId)
    .map((activity) => activity.money)
    .reduce(sumMoney, zero());

  return subtractMoney(depositBalance, withdrawalBalance);
};
