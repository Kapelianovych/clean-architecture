import { AccountId, Account } from '../../entities/account.entity';

export interface LoadAccountPort {
  (accountId: AccountId): Promise<Account>;
}
