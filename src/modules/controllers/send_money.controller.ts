import { constants } from 'http2';

import { get, accessRequest, responseFor } from '@prostory/mountain';

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

export const sendMoneyController = (
  sendMoneyUseCase: SendMoneyUseCase = sendMoneyService(
    inject(loadAccountPortSymbol),
    inject(updateAccountPortSymbol)
  )
) =>
  get(
    '/account/send\\?sourceAccountId=(\\d+)&targetAccountId=(\\d+)&amount=(\\d+)',
    (request) => {
      const { parameters } = accessRequest(request);

      const [sourceAccountId, targetAccountId, amount] = parameters;

      sendMoneyUseCase(
        createSendMoneyCommand(
          sourceAccountId as AccountId,
          targetAccountId as AccountId,
          createMoney(Number(amount))
        )
      ).then((result) =>
        result
          .map(() =>
            responseFor(request)
              .header(
                constants.HTTP2_HEADER_STATUS,
                String(constants.HTTP_STATUS_OK)
              )
              .body('Succeed. targetAccountId is happy.')
              .end()
          )
          .handle((code) => {
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
          })
      );
    }
  );
