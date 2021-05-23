import 'regenerator-runtime/runtime';

import { createMoney } from '../../entities/money.entity';
import { LoadAccountPort } from '../../ports/out/load_account.port';
import { sendMoneyService } from '../send_money.service';
import { UpdateAccountPort } from '../../ports/out/update_account.port';
import { createActivityWindow } from '../../entities/activity_window.entity';
import { createSendMoneyCommand } from '../../ports/in/send_money.command';
import {
  Account,
  AccountId,
  getBalance,
  createAccount,
} from '../../entities/account.entity';

describe('sendMoneyService', () => {
  it('should success transaction', async () => {
    const sourceAccountId: AccountId = '41';
    let sourceAccount = createAccount(
      sourceAccountId,
      createMoney(10),
      createActivityWindow()
    );

    const targetAccountId: AccountId = '42';
    let targetAccount = createAccount(
      targetAccountId,
      createMoney(1),
      createActivityWindow()
    );

    const loadAccountPort: LoadAccountPort = jest.fn(async (id: AccountId) =>
      id === sourceAccountId ? sourceAccount : targetAccount
    );
    const updateAccountPort: UpdateAccountPort = jest.fn(
      async (updatedAccount: Account) => {
        updatedAccount._id === sourceAccountId
          ? (sourceAccount = updatedAccount)
          : (targetAccount = updatedAccount);
        return true;
      }
    );

    const command = createSendMoneyCommand(
      sourceAccountId,
      targetAccountId,
      createMoney(4)
    );

    await sendMoneyService(loadAccountPort, updateAccountPort)(command);

    expect(updateAccountPort).toBeCalledTimes(2);
    expect(getBalance(sourceAccount).amount.toNumber()).toBe(6);
    expect(getBalance(targetAccount).amount.toNumber()).toBe(5);
  });
});
