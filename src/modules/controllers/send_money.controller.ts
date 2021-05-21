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
import { SendMoneyUseCase } from '../../domains/ports/in/send_money.use_case';
import { sendMoneyService } from '../../domains/services/send_money.service';
import { loadAccountPortSymbol } from '../../domains/ports/out/load_account.port';
import { createSendMoneyCommand } from '../../domains/ports/in/send_money.command';
import { updateAccountPortSymbol } from '../../domains/ports/out/update_account.port';
import {
  AccountId,
  AccountResult,
} from '../../domains/entities/account.entity';

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
    .body('Succeed. targetAccountId is happy.')
    .end();

const forbid = (request: Request) => (code: AccountResult) => {
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
  sendMoneyUseCase: SendMoneyUseCase = sendMoneyService(
    inject(loadAccountPortSymbol),
    inject(updateAccountPortSymbol)
  )
) =>
  get('/account/send', (request) => {
    const { url } = accessRequest(request);

    const sourceAccountId = maybe(url.searchParams.get('sourceAccountId'));
    const targetAccountId = maybe(url.searchParams.get('targetAccountId'));
    const amount = maybe(url.searchParams.get('amount'));

    gatherSearchParameters(sourceAccountId, targetAccountId, amount)
      .map(([sourceId, targetId, moneyAmount]) =>
        sendMoneyUseCase(
          createSendMoneyCommand(
            sourceId as AccountId,
            targetId as AccountId,
            createMoney(Number(moneyAmount))
          )
        ).then((result) => result.map(success(request)).handle(forbid(request)))
      )
      .fill(missedParameters(request));
  });
