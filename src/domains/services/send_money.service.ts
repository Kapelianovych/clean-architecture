import { Right } from '@fluss/core';

import { inject, provide } from '../../packages/di/container';
import { depositMoney, withdrawMoney } from '../entities/account.entity';
import {
  LoadAccountPort,
  loadAccountPortSymbol,
} from '../ports/out/load_account.port';
import {
  SendMoneyUseCase,
  sendMoneyUseCaseSymbol,
} from '../ports/in/send_money.use_case';
import { SendMoneyCommand } from '../ports/in/send_money.command';
import {
  UpdateAccountPort,
  updateAccountPortSymbol,
} from '../ports/out/update_account.port';

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

provide(sendMoneyUseCaseSymbol).asFactory(() =>
  sendMoneyService(
    inject(loadAccountPortSymbol),
    inject(updateAccountPortSymbol)
  )
);
