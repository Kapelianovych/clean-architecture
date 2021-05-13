import { LoadAccountPort } from '../ports/out/load_account.port';
import { SendMoneyUseCase } from '../ports/in/send_money.use_case';
import { SendMoneyCommand } from '../ports/in/send_money.command';
import { UpdateAccountPort } from '../ports/out/update_account.port';
import { Account, withdrawMoney } from '../entities/account.entity';

export const sendMoneyService =
  (
    loadAccountPort: LoadAccountPort,
    updateAccountPort: UpdateAccountPort
  ): SendMoneyUseCase =>
  (command: SendMoneyCommand) =>
    withdrawMoney(
      loadAccountPort(command.sourceAccountId),
      loadAccountPort(command.targetAccountId),
      command.money
    )
      .map(Object.values)
      .map((accounts: ReadonlyArray<Account>) =>
        accounts.forEach(updateAccountPort)
      );
