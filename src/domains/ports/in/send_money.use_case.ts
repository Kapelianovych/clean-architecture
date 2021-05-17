import { Either } from '@fluss/core';

import { AccountResult } from '../../entities/account.entity';
import { SendMoneyCommand } from './send_money.command';

export const sendMoneyUseCaseSymbol = Symbol('sendMoneyUseCase');

export interface SendMoneyUseCase {
  (command: SendMoneyCommand): Promise<Either<AccountResult, Promise<boolean>>>;
}
