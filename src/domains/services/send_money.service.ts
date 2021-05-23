import { Right } from '@fluss/core';

import { LoadAccountPort } from '../ports/out/load_account.port';
import { SendMoneyUseCase } from '../ports/in/send_money.use_case';
import { SendMoneyCommand } from '../ports/in/send_money.command';
import { UpdateAccountPort } from '../ports/out/update_account.port';
import { depositMoney, withdrawMoney } from '../entities/account.entity';

export const sendMoneyService =
  (
    loadAccountPort: LoadAccountPort,
    updateAccountPort: UpdateAccountPort
  ): SendMoneyUseCase =>
  async (command: SendMoneyCommand) => {
    const withdrawResult = withdrawMoney(
      await loadAccountPort(command.sourceAccountId),
      await loadAccountPort(command.targetAccountId),
      command.money
    ).map(updateAccountPort);

    const depositResult = depositMoney(
      await loadAccountPort(command.targetAccountId),
      await loadAccountPort(command.sourceAccountId),
      command.money
    ).map(updateAccountPort);

    return withdrawResult.chain(
      (withdrawSuccess) =>
        depositResult.map(
          async (depositSuccess) =>
            (await withdrawSuccess) && (await depositSuccess)
        ) as Right<Promise<boolean>>
    );
  };
