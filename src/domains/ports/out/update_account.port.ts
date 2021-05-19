import { Account } from '../../entities/account.entity';

export const updateAccountPortSymbol = Symbol('updateAccountPort');

export interface UpdateAccountPort {
  (account: Account): Promise<boolean>;
}
