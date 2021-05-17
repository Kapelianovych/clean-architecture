import { createMoney } from '../money.entity';
import { createActivity } from '../activity.entity';
import {
  calculateBalance,
  createActivityWindow,
} from '../activity_window.entity';

describe('activity window entity', () => {
  it('should calculate balance of account', () => {
    const accountId = '57';

    const date = new Date()

    const window = createActivityWindow([
      createActivity('41', '41', accountId, createMoney(8), date, 1),
      createActivity('41', '41', accountId, createMoney(5), date, 2),
      createActivity(accountId, accountId, '41', createMoney(3), date, 3),
      createActivity('41', '41', accountId, createMoney(9), date, 4),
      createActivity(accountId, accountId, '41', createMoney(1), date, 5),
    ]);

    expect(calculateBalance(window, accountId)).toEqual(createMoney(18));
  });
});
