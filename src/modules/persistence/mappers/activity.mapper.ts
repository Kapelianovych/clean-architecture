import { createMoney } from '../../../domains/entities/money.entity';
import { ActivityOrmEntity } from '../entities/activity.orm_entity';
import {
  Activity,
  createActivity,
} from '../../../domains/entities/activity.entity';

export const mapActivityToDomain = ({
  id,
  amount,
  timestamp,
  ownerAccountId,
  sourceAccountId,
  targetAccountId,
}: ActivityOrmEntity) =>
  createActivity(
    ownerAccountId,
    sourceAccountId,
    targetAccountId,
    createMoney(amount),
    new Date(timestamp),
    id
  );

export const mapActivityToOrm = (activity: Activity): ActivityOrmEntity => {
  const activityOrmEntity = new ActivityOrmEntity();

  activityOrmEntity.timestamp = activity.timestamp.getTime();
  activityOrmEntity.ownerAccountId = activity.ownerAccountId;
  activityOrmEntity.sourceAccountId = activity.ownerAccountId;
  activityOrmEntity.targetAccountId = activity.targetAccountId;
  activityOrmEntity.amount = activity.money.amount.toNumber();

  if (activity._id !== undefined) {
    activityOrmEntity.id = activity._id;
  }

  return activityOrmEntity;
};
