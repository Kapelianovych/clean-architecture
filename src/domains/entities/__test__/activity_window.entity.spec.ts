import { createMoney } from '../money.entity';
import { createActivity } from '../activity.entity';
import {
  calculateBalance,
  createActivityWindow,
} from '../activity_window.entity';

describe('activity window entity', () => {
  it('should calculate balance of account', () => {
    const accountId = '57';

    const window = createActivityWindow([
      createActivity('41', '41', accountId, createMoney(8)),
      createActivity('41', '41', accountId, createMoney(5)),
      createActivity(accountId, accountId, '41', createMoney(3)),
      createActivity('41', '41', accountId, createMoney(9)),
      createActivity(accountId, accountId, '41', createMoney(1)),
    ]);

    expect(calculateBalance(window, accountId)).toEqual(createMoney(18));
  });
});
