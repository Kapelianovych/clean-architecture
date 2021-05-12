import { Flavor, left, pipe, right } from '@fluss/core';

import { Activity, createActivity } from './activity.entity';
import {
  ActivityWindow,
  calculateBalance,
  addActivityToWindow,
  createActivityWindow,
} from './activity_window.entity';
import {
  Money,
  sumMoney,
  negateMoney,
  subtractMoney,
  isPositiveOrZero,
} from './money.entity';

export type AccountId = Flavor<string, 'AccountId'>;

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

export enum AccountResult {
  DEPOSIT_NOT_PERMITTED,
  WITHDRAW_NOT_PERMITTED,
}

const createAccountState = (
  state: Partial<AccountState> = {}
): AccountState => ({ frozen: false, closed: false, ...state });

export const createAccount = (
  id: AccountId,
  balance: Money,
  activityWindow: ActivityWindow = createActivityWindow(),
  state?: Partial<AccountState>
): Account => ({
  _id: id,
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

const attachActivity = (account: Account, activity: Activity): Account =>
  createAccount(
    account._id,
    account.baseLineBalance,
    addActivityToWindow(account.activityWindow, activity),
    account.state
  );

export const withdrawMoney = (
  sourceAccount: Account,
  targetAccount: Account,
  money: Money
) =>
  mayWithdrawMoney(getBalance(sourceAccount), money)
    ? mayDepositMoney(targetAccount)
      ? right({
          sourceAccount: attachActivity(
            sourceAccount,
            createActivity(sourceAccount._id, targetAccount._id, money)
          ),
          targetAccount: attachActivity(
            targetAccount,
            createActivity(sourceAccount._id, targetAccount._id, money)
          ),
        })
      : left(AccountResult.DEPOSIT_NOT_PERMITTED)
    : left(AccountResult.WITHDRAW_NOT_PERMITTED);

export const depositMoney = (
  sourceAccount: Account,
  targetAccount: Account,
  money: Money
) => withdrawMoney(sourceAccount, targetAccount, negateMoney(money));
