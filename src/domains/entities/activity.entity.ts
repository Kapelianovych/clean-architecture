import { v4 as id } from 'uuid';
import { Flavor } from '@fluss/core';

import { Money } from './money.entity';
import { AccountId } from './account.entity';

export type ActivityId = Flavor<string, 'ActivityId'>;

export interface Activity {
  readonly _id: ActivityId;
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
  money: Money
): Activity => ({
  _id: id() as ActivityId,
  money,
  timestamp: new Date(),
  ownerAccountId,
  sourceAccountId,
  targetAccountId,
});
