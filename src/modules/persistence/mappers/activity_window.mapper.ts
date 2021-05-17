import { ActivityOrmEntity } from '../activity.orm_entity';
import { mapActivityToDomain } from './activity.mapper';
import {
  ActivityWindow,
  createActivityWindow,
} from '../../../domains/entities/activity_window.entity';

export const mapActivityWindowToDomain = (
  activities: ReadonlyArray<ActivityOrmEntity>
): ActivityWindow => createActivityWindow(activities.map(mapActivityToDomain));
