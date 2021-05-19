import { constants } from 'http2';

import { get, accessRequest, responseFor } from '@prostory/mountain';

import { inject } from '../../packages/di/container';
import { AccountId } from '../../domains/entities/account.entity';
import { createMoney } from '../../domains/entities/money.entity';
import { SendMoneyUseCase } from '../../domains/ports/in/send_money.use_case';
import { sendMoneyService } from '../../domains/services/send_money.service';
import { loadAccountPortSymbol } from '../../domains/ports/out/load_account.port';
import { createSendMoneyCommand } from '../../domains/ports/in/send_money.command';
import { updateAccountPortSymbol } from '../../domains/ports/out/update_account.port';

export const sendMoneyController = (
  sendMoneyUseCase: SendMoneyUseCase = sendMoneyService(
    inject(loadAccountPortSymbol),
    inject(updateAccountPortSymbol)
  )
) =>
  get('/account/send(?:\\?.+)?', (request) => {
    const { path } = accessRequest(request);

    const sourceAccountId = new URLSearchParams(path).get('sourceAccountId');
    const targetAccountId = new URLSearchParams(path).get('targetAccountId');
    const amount = new URLSearchParams(path).get('amount');

    sendMoneyUseCase(
      createSendMoneyCommand(
        sourceAccountId as AccountId,
        targetAccountId as AccountId,
        createMoney(amount!)
      )
    ).then((result) =>
      result
        .map(() =>
          responseFor(request)
            .header(
              constants.HTTP2_HEADER_STATUS,
              String(constants.HTTP_STATUS_OK)
            )
            .end()
        )
        .handle((code) =>
          responseFor(request)
            .header(
              constants.HTTP2_HEADER_STATUS,
              String(constants.HTTP_STATUS_FORBIDDEN)
            )
            .body(`Failed with code: ${code}.`)
            .end()
        )
    );
  });
