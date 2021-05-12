import { withdrawMoney } from '../entities/account.entity';
import { LoadAccountPort } from '../ports/out/load_account.port';
import { SendMoneyUseCase } from '../ports/in/send_money.use_case';
import { SendMoneyCommand } from '../ports/in/send_money.command';
import { UpdateAccountPort } from '../ports/out/update_account.port';

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
    ).map(({ sourceAccount, targetAccount }) => {
      updateAccountPort(sourceAccount);
      updateAccountPort(targetAccount);
    });
