import { pipe } from '@fluss/core';

import { getBalance } from '../entities/account.entity';
import { LoadAccountPort } from '../ports/out/load_account.port';
import { GetAccountBalanceQuery } from '../ports/in/get_account_balance.query';

export const getAccountBalanceService = (
  loadAccountPort: LoadAccountPort
): GetAccountBalanceQuery => pipe(loadAccountPort, getBalance);
