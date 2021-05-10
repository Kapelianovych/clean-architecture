import { v4 as id } from 'uuid';
import { Brand, pipe } from '@fluss/core';

import { createActivity } from './activity.entity';
import {
  Money,
  sumMoney,
  subtractMoney,
  isPositiveOrZero,
} from './money.entity';
import {
  ActivityWindow,
  calculateBalance,
  addActivityToWindow,
  createActivityWindow,
} from './activity_window.entity';

export type AccountId = Brand<string, 'AccountId'>;

type AccountState = {
  readonly frozen: boolean;
  readonly closed: boolean;
};

export interface Account {
  readonly _id: AccountId;
  readonly state: AccountState;
  readonly baseLineBalance: Money;
  readonly activityWindow: ActivityWindow;
}

const createAccountState = (
  state: Partial<AccountState> = {}
): AccountState => ({ frozen: false, closed: false, ...state });

export const createAccount = (
  balance: Money,
  activityWindow: ActivityWindow = createActivityWindow(),
  state?: Partial<AccountState>
): Account => ({
  _id: id() as AccountId,
  state: createAccountState(state),
  activityWindow,
  baseLineBalance: balance,
});

export const getBalance = (account: Account): Money =>
  sumMoney(
    account.baseLineBalance,
    calculateBalance(account.activityWindow, account._id)
  );

const mayWithdrawMoney = pipe(subtractMoney, isPositiveOrZero);
// Here we should check if an account is not blocked and
// it is able to accept money. There are many use cases.
const mayDepositMoney = (account: Account) =>
  !account.state.closed && !account.state.frozen;

export const withdrawMoney = (
  sourceAccount: Account,
  targetAccount: Account,
  money: Money
) =>
  mayWithdrawMoney(getBalance(sourceAccount), money) &&
  mayDepositMoney(targetAccount)
    ? {
        sourceAccount: createAccount(
          sourceAccount.baseLineBalance,
          addActivityToWindow(
            sourceAccount.activityWindow,
            createActivity(sourceAccount._id, targetAccount._id, money)
          ),
          sourceAccount.state
        ),
        targetAccount,
      }
    : { sourceAccount, targetAccount };

export const depositMoney = (
  sourceAccount: Account,
  targetAccount: Account,
  money: Money
) => withdrawMoney(targetAccount, sourceAccount, money);
