import { Account, User } from '@prisma/client';
import CashInCashOut from 'src/types/CashInCashOut';
import OrderBy from 'src/types/OrderBy';

interface GetTransactionsInput {
  accountId: Account['id'];
  orderBy?: OrderBy;
  type?: CashInCashOut;
  username: User['username'];
}

export default GetTransactionsInput;
