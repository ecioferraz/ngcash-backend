import { Transaction, User } from '@prisma/client';

interface TransactionBody {
  creditedUsername: User['username'];
  debitedUsername: User['username'];
  value: Transaction['value'];
}

export default TransactionBody;
