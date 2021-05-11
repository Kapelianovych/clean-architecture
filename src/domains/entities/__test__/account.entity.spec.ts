import { createMoney } from '../money.entity';
import { createActivity } from '../activity.entity';
import { createActivityWindow } from '../activity_window.entity';
import {
  getBalance,
  depositMoney,
  createAccount,
  withdrawMoney,
} from '../account.entity';

describe('account entity', () => {
  it("should get account's balance", () => {
    const accountId = '41';

    const activityWindow = createActivityWindow([
      createActivity('42', accountId, createMoney(30)),
      createActivity('42', accountId, createMoney(170)),
      createActivity(accountId, '42', createMoney(300)),
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

    const { sourceAccount: source, targetAccount: target } = withdrawMoney(
      sourceAccount,
      targetAccount,
      money
    );

    expect(getBalance(source)).toEqual(createMoney(8));
    expect(getBalance(target)).toEqual(createMoney(9));
  });

  it('should deposit money', () => {
    const sourceAccountId = '1';
    const targetAccountId = '2';

    const sourceAccount = createAccount(sourceAccountId, createMoney(10));
    const targetAccount = createAccount(targetAccountId, createMoney(7));

    const { sourceAccount: source, targetAccount: target } = depositMoney(
      sourceAccount,
      targetAccount,
      createMoney(2)
    );

    expect(getBalance(source)).toEqual(createMoney(12));
    expect(getBalance(target)).toEqual(createMoney(5));
  });

  it('should not deposit money if target account is frozen', () => {
    const sourceAccount = createAccount('1', createMoney(10));
    const targetAccount = createAccount(
      '2',
      createMoney(7),
      createActivityWindow(),
      { frozen: true }
    );

    const { sourceAccount: source, targetAccount: target } = withdrawMoney(
      sourceAccount,
      targetAccount,
      createMoney(2)
    );

    expect(getBalance(source)).toEqual(createMoney(10));
    expect(getBalance(target)).toEqual(createMoney(7));
  });

  it('should not deposit money if target account is closed', () => {
    const sourceAccount = createAccount('21', createMoney(10));
    const targetAccount = createAccount(
      '91827',
      createMoney(7),
      createActivityWindow(),
      { closed: true }
    );

    const { sourceAccount: source, targetAccount: target } = withdrawMoney(
      sourceAccount,
      targetAccount,
      createMoney(2)
    );

    expect(getBalance(source)).toEqual(createMoney(10));
    expect(getBalance(target)).toEqual(createMoney(7));
  });

  it('should not withdraw money if source account has not enough money', () => {
    const sourceAccount = createAccount('9873', createMoney(0));
    const targetAccount = createAccount('234', createMoney(4));

    const { sourceAccount: source, targetAccount: target } = withdrawMoney(
      sourceAccount,
      targetAccount,
      createMoney(10)
    );

    expect(getBalance(source)).toEqual(createMoney(0));
    expect(getBalance(target)).toEqual(createMoney(4));
  });
});
