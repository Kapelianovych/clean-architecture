import { constants } from 'http2';

import { accessRequest, get, responseFor } from '@prostory/mountain';

import { inject } from '../../packages/di/container';
import { loadAccountPortSymbol } from '../../domains/ports/out/load_account.port';
import { getAccountBalanceService } from '../../domains/services/get_account_balance.service';

export const getAccountBalanceController = (
  getAccountBalanceQuery = getAccountBalanceService(
    inject(loadAccountPortSymbol)
  )
) =>
  get('/balance/(\\d+)', (request) => {
    const { parameters } = accessRequest(request);

    getAccountBalanceQuery(parameters[0])
      .then((money) =>
        responseFor(request)
          .body(
            `Account with id: ${parameters[0]} has ${money.amount.toNumber()}$.`
          )
          .end()
      )
      .catch(() =>
        responseFor(request)
          .header(
            constants.HTTP2_HEADER_STATUS,
            String(constants.HTTP_STATUS_NOT_FOUND)
          )
          .body(`Account with id: ${parameters[0]} did not found.`)
          .end()
      );
  });
