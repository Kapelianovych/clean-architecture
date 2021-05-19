import { createConnection } from 'typeorm';

import './adapters';

export const establishConnectionWithDatabase = () => createConnection();
