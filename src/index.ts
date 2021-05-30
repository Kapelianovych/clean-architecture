import { readFileSync } from 'fs';

import 'reflect-metadata';
import { server } from '@prostory/mountain';

import './domains';

import { establishConnectionWithDatabase } from './modules/persistence';
import {
  sendMoneyController,
  getAccountBalanceController,
} from './modules/controllers';

const startServer = () =>
  server({
    key: readFileSync('certs/key.pem'),
    cert: readFileSync('certs/cert.pem'),
  })
    .use(getAccountBalanceController(), sendMoneyController())
    .listen(4000);

establishConnectionWithDatabase().then(startServer);
