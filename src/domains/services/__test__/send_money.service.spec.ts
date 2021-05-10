import { createMoney } from '../../entities/money.entity';
import { LoadAccountPort } from '../../ports/out/load_account.port';
import { sendMoneyService } from '../send_money.service';
import { UpdateAccountPort } from '../../ports/out/update_account.port';
import { createActivityWindow } from '../../entities/activity_window.entity';
import { createSendMoneyCommand } from '../../ports/in/send_money.command';
import {
  Account,
  AccountId,
  createAccount,
} from '../../entities/account.entity';

describe('sendMoneyService', () => {
  it('should success transaction', () => {
    const loadAccountPort: LoadAccountPort = jest.fn((_: AccountId) =>
      createAccount(createMoney(10), createActivityWindow())
    );
    const updateAccountPort: UpdateAccountPort = jest.fn((_: Account) => true);

    const command = createSendMoneyCommand(
      '41' as AccountId,
      '42' as AccountId,
      createMoney(4)
    );

    sendMoneyService(loadAccountPort, updateAccountPort)(command);

    expect(updateAccountPort).toBeCalledTimes(2);
  });
});
