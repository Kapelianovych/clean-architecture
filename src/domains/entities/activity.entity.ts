import { Flavor } from '@fluss/core';

import { Money } from './money.entity';
import { AccountId } from './account.entity';

export type ActivityId = Flavor<number, 'ActivityId'>;

export interface Activity {
  readonly _id?: ActivityId;
  readonly money: Money;
  readonly timestamp: Date;
  readonly ownerAccountId: AccountId;
  readonly sourceAccountId: AccountId;
  readonly targetAccountId: AccountId;
}

export const createActivity = (
  ownerAccountId: AccountId,
  sourceAccountId: AccountId,
  targetAccountId: AccountId,
  money: Money,
  timestamp?: Date,
  activityId?: ActivityId
): Activity => ({
  _id: activityId,
  money,
  timestamp: timestamp ?? new Date(),
  ownerAccountId,
  sourceAccountId,
  targetAccountId,
});
