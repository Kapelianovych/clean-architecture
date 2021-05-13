import { createMoney } from '../money.entity';
import { createActivity } from '../activity.entity';
import { createActivityWindow } from '../activity_window.entity';
import {
  getBalance,
  depositMoney,
  createAccount,
  withdrawMoney,
  AccountResult,
} from '../account.entity';

describe('account entity', () => {
  it("should get account's balance", () => {
    const accountId = '41';

    const activityWindow = createActivityWindow([
      createActivity('42', '42', accountId, createMoney(30)),
      createActivity('42', '42', accountId, createMoney(170)),
      createActivity(accountId, accountId, '42', createMoney(300)),
    ]);
    const account = createAccount(accountId, createMoney(100), activityWindow);

    expect(getBalance(account)).toEqual(createMoney(0));
  });

  it('should withdraw money', () => {
    const sourceAccountId = '1';
    const targetAccountId = '2';

    const sourceAccount = createAccount(sourceAccountId, createMoney(10));
    const targetAccount = createAccount(targetAccountId, createMoney(7));

    const money = createMoney(2);

    const result = withdrawMoney(sourceAccount, targetAccount, money);

    expect(result.isRight()).toBe(true);
    result.map(({ emitter, recipient }) => {
      expect(getBalance(emitter)).toEqual(createMoney(8));
      expect(getBalance(recipient)).toEqual(createMoney(9));
    });
  });

  it('should deposit money', () => {
    const sourceAccountId = '1';
    const targetAccountId = '2';

    const sourceAccount = createAccount(sourceAccountId, createMoney(10));
    const targetAccount = createAccount(targetAccountId, createMoney(7));

    const result = depositMoney(sourceAccount, targetAccount, createMoney(2));

    expect(result.isRight()).toBe(true);
    result.map(({ emitter, recipient }) => {
      expect(getBalance(recipient)).toEqual(createMoney(12));
      expect(getBalance(emitter)).toEqual(createMoney(5));
    });
  });

  it('should not deposit money if target account is frozen', () => {
    const sourceAccount = createAccount('1', createMoney(10));
    const targetAccount = createAccount(
      '2',
      createMoney(7),
      createActivityWindow(),
      { frozen: true }
    );

    const result = withdrawMoney(sourceAccount, targetAccount, createMoney(2));

    expect(result.isLeft()).toBe(true);
    expect(result.extract()).toBe(AccountResult.DEPOSIT_NOT_PERMITTED);
  });

  it('should not deposit money if target account is closed', () => {
    const sourceAccount = createAccount('21', createMoney(10));
    const targetAccount = createAccount(
      '91827',
      createMoney(7),
      createActivityWindow(),
      { closed: true }
    );

    const result = withdrawMoney(sourceAccount, targetAccount, createMoney(2));

    expect(result.isLeft()).toBe(true);
    expect(result.extract()).toBe(AccountResult.DEPOSIT_NOT_PERMITTED);
  });

  it('should not withdraw money if source account has not enough money', () => {
    const sourceAccount = createAccount('9873', createMoney(0));
    const targetAccount = createAccount('234', createMoney(4));

    const result = withdrawMoney(sourceAccount, targetAccount, createMoney(10));

    expect(result.isLeft()).toBe(true);
    expect(result.extract()).toBe(AccountResult.WITHDRAW_NOT_PERMITTED);
  });
});
