import { calculateBalance } from '../../../domains/entities/activity_window.entity';
import { AccountOrmEntity } from '../account.orm_entity';
import { ActivityOrmEntity } from '../activity.orm_entity';
import { Account, createAccount } from '../../../domains/entities/account.entity';
import { mapActivityWindowToDomain } from './activity_window.mapper';

export const mapAccountToDomain = (
  account: AccountOrmEntity,
  activities: ReadonlyArray<ActivityOrmEntity>
): Account => {
  const activityWindow = mapActivityWindowToDomain(activities);
  const balance = calculateBalance(activityWindow, account.userId);
  return createAccount(account.userId, balance, activityWindow);
};
