import { AccountId, Account } from '../../entities/account.entity';

export const loadAccountPortSymbol = Symbol('loadAccountPort');

export interface LoadAccountPort {
  (accountId: AccountId): Promise<Account>;
}
