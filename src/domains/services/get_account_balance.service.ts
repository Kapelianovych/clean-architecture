import { pipe } from '@fluss/core';

import { getBalance } from '../entities/account.entity';
import { inject, provide } from '../../packages/di/container';
import {
  LoadAccountPort,
  loadAccountPortSymbol,
} from '../ports/out/load_account.port';
import {
  GetAccountBalanceQuery,
  getAccountBalanceQuerySymbol,
} from '../ports/in/get_account_balance.query';

export const getAccountBalanceService = (
  loadAccountPort: LoadAccountPort
): GetAccountBalanceQuery => pipe(loadAccountPort, getBalance);

provide(getAccountBalanceQuerySymbol).asFactory(() =>
  getAccountBalanceService(inject(loadAccountPortSymbol))
);
