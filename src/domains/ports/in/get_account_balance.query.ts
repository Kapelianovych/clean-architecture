import { Money } from '../../entities/money.entity';
import { AccountId } from '../../entities/account.entity';

export const getAccountBalanceQuerySymbol = Symbol('getAccountBalance');

export interface GetAccountBalanceQuery {
  (accountId: AccountId): Promise<Money>;
}
