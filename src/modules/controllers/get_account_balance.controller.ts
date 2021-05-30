import { constants } from 'http2';

import { accessRequest, get, responseFor } from '@prostory/mountain';

import { inject } from '../../packages/di/container';
import {
  GetAccountBalanceQuery,
  getAccountBalanceQuerySymbol,
} from '../../domains/ports/in/get_account_balance.query';

export const getAccountBalanceController = (
  getAccountBalance = inject<GetAccountBalanceQuery>(
    getAccountBalanceQuerySymbol
  )
) =>
  get('/balance/(\\d+)', (request) => {
    const { parameters } = accessRequest(request);

    getAccountBalance(parameters[0])
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
