import { Either } from '@fluss/core';

import { AccountResult } from '../../entities/account.entity';
import { SendMoneyCommand } from './send_money.command';

export interface SendMoneyUseCase {
  (command: SendMoneyCommand): Either<AccountResult, void>;
}
