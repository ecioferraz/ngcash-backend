import { Account, User } from '@prisma/client';
import CashInCashOut from '../types/CashInCashOut';
import OrderBy from '../types/OrderBy';

interface GetTransactionsInput {
  accountId: Account['id'];
  orderBy?: OrderBy;
  type?: CashInCashOut;
  username: User['username'];
}

export default GetTransactionsInput;
