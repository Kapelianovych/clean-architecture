import { constants } from 'http2';

import { get, accessRequest, responseFor, Request } from '@prostory/mountain';
import {
  none,
  some,
  Tuple,
  tuple,
  maybe,
  Option,
  isNothing,
} from '@fluss/core';

import { inject } from '../../packages/di/container';
import { createMoney } from '../../domains/entities/money.entity';
import { AccountResult } from '../../domains/entities/account.entity';
import { createSendMoneyCommand } from '../../domains/ports/in/send_money.command';
import {
  SendMoneyUseCase,
  sendMoneyUseCaseSymbol,
} from '../../domains/ports/in/send_money.use_case';

const gatherSearchParameters = (
  ...parameters: ReadonlyArray<Option<string>>
): Option<Tuple<string[]>> =>
  parameters.reduce(
    (previous: Option<Tuple<string[]>>, current) =>
      previous.chain((value) =>
        current.chain((secondValue) =>
          isNothing(secondValue) ? none : some(value.append(secondValue))
        )
      ),
    some(tuple())
  );

const success = (request: Request) => () =>
  responseFor(request)
    .header(constants.HTTP2_HEADER_STATUS, String(constants.HTTP_STATUS_OK))
    .body('Succeed. Target account is happy.')
    .end();

const forbidden = (request: Request) => (code: AccountResult) => {
  responseFor(request)
    .header(
      constants.HTTP2_HEADER_STATUS,
      String(constants.HTTP_STATUS_FORBIDDEN)
    )
    .json({
      code,
      reason:
        AccountResult.WITHDRAW_NOT_PERMITTED === code
          ? 'Source account has not enough money.'
          : 'Target account cannot receive money.',
    });
};

const missedParameters = (request: Request) => () =>
  responseFor(request)
    .header(
      constants.HTTP2_HEADER_STATUS,
      String(constants.HTTP_STATUS_NOT_ACCEPTABLE)
    )
    .body('You did not pass all needed parameters.')
    .end();

export const sendMoneyController = (
  sendMoneyUseCase: SendMoneyUseCase = inject(sendMoneyUseCaseSymbol)
) =>
  get('/account/send', (request) => {
    const { url } = accessRequest(request);

    const sourceAccountId = maybe(url.searchParams.get('sourceAccountId'));
    const targetAccountId = maybe(url.searchParams.get('targetAccountId'));
    const amount = maybe(url.searchParams.get('amount'));

    gatherSearchParameters(sourceAccountId, targetAccountId, amount)
      .map(([sourceId, targetId, moneyAmount]) =>
        sendMoneyUseCase(
          createSendMoneyCommand(sourceId, targetId, createMoney(moneyAmount))
        ).then((result) =>
          result.map(success(request)).handle(forbidden(request))
        )
      )
      .fill(missedParameters(request));
  });
