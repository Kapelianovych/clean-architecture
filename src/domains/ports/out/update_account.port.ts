import { Account } from '../../entities/account.entity';

export interface UpdateAccountPort {
  (account: Account): Promise<boolean>;
}
