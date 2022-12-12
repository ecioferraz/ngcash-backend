import { Transaction, User } from '@prisma/client';

interface TransactionInput {
  creditedAccountId: Transaction['id'];
  debitedAccountId: Transaction['id'];
  debitedUsername: User['username'];
  value: Transaction['value'];
}

export default TransactionInput;
