import { SendMoneyCommand } from './send_money.command';

export interface SendMoneyUseCase {
  (command: SendMoneyCommand): void;
}
