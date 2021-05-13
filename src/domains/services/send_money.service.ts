import { pipe } from '@fluss/core';

import { LoadAccountPort } from '../ports/out/load_account.port';
import { SendMoneyUseCase } from '../ports/in/send_money.use_case';
import { SendMoneyCommand } from '../ports/in/send_money.command';
import { UpdateAccountPort } from '../ports/out/update_account.port';
import { Account, withdrawMoney } from '../entities/account.entity';

const reduceUpdateResults = pipe(
  (results: ReadonlyArray<Promise<boolean>>) => Promise.all(results),
  (results: ReadonlyArray<boolean>): boolean =>
    results.reduce((all, current) => all && current)
);

export const sendMoneyService =
  (
    loadAccountPort: LoadAccountPort,
    updateAccountPort: UpdateAccountPort
  ): SendMoneyUseCase =>
  async (command: SendMoneyCommand) =>
    withdrawMoney(
      await loadAccountPort(command.sourceAccountId),
      await loadAccountPort(command.targetAccountId),
      command.money
    )
      .map(Object.values)
      .map((accounts: ReadonlyArray<Account>) =>
        reduceUpdateResults(accounts.map(updateAccountPort))
      );
