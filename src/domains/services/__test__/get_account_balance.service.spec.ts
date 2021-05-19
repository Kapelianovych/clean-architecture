import 'regenerator-runtime/runtime';

import { createMoney } from '../../entities/money.entity';
import { createActivity } from '../../entities/activity.entity';
import { LoadAccountPort } from '../../ports/out/load_account.port';
import { createActivityWindow } from '../../entities/activity_window.entity';
import { getAccountBalanceService } from '../get_account_balance.service';
import { AccountId, createAccount } from '../../entities/account.entity';

describe('getAccountBalanceService', () => {
  it('should get balance from account', async () => {
    const accountId = '7';
    const loadAccountPort: LoadAccountPort = jest.fn(async (_: AccountId) =>
      createAccount(
        accountId,
        createMoney(10),
        createActivityWindow([
          createActivity(accountId, accountId, '8', createMoney(3)),
        ])
      )
    );

    const getBalance = getAccountBalanceService(loadAccountPort);
    const money = await getBalance(accountId);

    expect(money.amount.toNumber()).toBe(7);
  });
});
