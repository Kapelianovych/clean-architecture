import { getRepository, Repository } from 'typeorm';

import { provide } from '../../../packages/di/container';
import { mapActivityToOrm } from '../mappers/activity.mapper';
import { AccountOrmEntity } from '../entities/account.orm_entity';
import { ActivityOrmEntity } from '../entities/activity.orm_entity';
import {
  UpdateAccountPort,
  updateAccountPortSymbol,
} from '../../../domains/ports/out/update_account.port';

const updateAccountAdapter =
  (
    accountRepository: Repository<AccountOrmEntity> = getRepository(
      AccountOrmEntity
    ),
    activityRepository: Repository<ActivityOrmEntity> = getRepository(
      ActivityOrmEntity
    )
  ): UpdateAccountPort =>
  (account) =>
    Promise.all(
      account.activityWindow.activities.map((activity) => {
        if (activity._id === undefined) {
          return activityRepository.save(mapActivityToOrm(activity)).then(
            () => true,
            () => false
          );
        }
      })
    ).then((results) =>
      results
        .filter((result) => result !== undefined)
        .every((isSuccessful) => isSuccessful)
    );

provide(updateAccountPortSymbol).toFactory(() => updateAccountAdapter());
