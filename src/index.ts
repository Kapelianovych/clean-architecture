import { readFileSync } from 'fs';

import 'reflect-metadata';
import { server } from '@prostory/mountain';

import { sendMoneyController } from './modules/controllers/send_money.controller';
import { establishConnectionWithDatabase } from './modules/persistence/connection';

const startServer = () =>
  server({
    key: readFileSync('certs/key.pem'),
    cert: readFileSync('certs/cert.pem'),
  })
    .use(sendMoneyController())
    .listen(4000);

establishConnectionWithDatabase().then(startServer);
