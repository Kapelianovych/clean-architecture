import { Money } from '../../entities/money.entity';
import { AccountId } from '../../entities/account.entity';

export interface GetAccountBalanceQuery {
  (accountId: AccountId): Money;
}
