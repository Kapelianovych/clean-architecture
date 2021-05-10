import { Money } from '../../entities/money.entity';
import { AccountId } from '../../entities/account.entity';

export interface SendMoneyCommand {
  readonly money: Money;
  readonly sourceAccountId: AccountId;
  readonly targetAccountId: AccountId;
}

export const createSendMoneyCommand = (
  sourceAccountId: AccountId,
  targetAccountId: AccountId,
  money: Money
): SendMoneyCommand => ({ money, sourceAccountId, targetAccountId });
