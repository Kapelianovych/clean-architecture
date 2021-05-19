import { getRepository, Repository } from 'typeorm';

import { provide } from '../../../packages/di/container';
import { AccountOrmEntity } from '../entities/account.orm_entity';
import { ActivityOrmEntity } from '../entities/activity.orm_entity';
import { mapAccountToDomain } from '../mappers/account.mapper';
import {
  LoadAccountPort,
  loadAccountPortSymbol,
} from '../../../domains/ports/out/load_account.port';

const loadAccountAdapter =
  (
    accountRepository: Repository<AccountOrmEntity> = getRepository(
      AccountOrmEntity
    ),
    activityRepository: Repository<ActivityOrmEntity> = getRepository(
      ActivityOrmEntity
    )
  ): LoadAccountPort =>
  async (id) => {
    const account = await accountRepository.findOne({ userId: id });
    if (account === undefined) {
      return Promise.reject(new Error('Account is not found.'));
    }

    const activities = await activityRepository.find({ ownerAccountId: id });
    return mapAccountToDomain(account, activities);
  };

provide(loadAccountPortSymbol).toFactory(() => loadAccountAdapter());
