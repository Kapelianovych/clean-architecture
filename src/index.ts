import { readFileSync } from 'fs';

import 'reflect-metadata';
import { server } from '@prostory/mountain';

import { inject } from './modules/di/container';
import { sendMoneyController } from './modules/interactors/send_money.controller';
import { sendMoneyUseCaseSymbol } from './domains/ports/in/send_money.use_case';

server({
  key: readFileSync('../certs/key.pem'),
  cert: readFileSync('../certs/cert.pem'),
})
  .use(
    sendMoneyController(inject(sendMoneyUseCaseSymbol))
  )
  .listen(4000);
