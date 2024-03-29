import { Account, Prisma, Transaction, User } from '@prisma/client';
import TransactionInput from '../../../interfaces/TransactionInput';
import UserMatch from '../../../interfaces/UserMatch';
import GetTransactionsInput from '../../../interfaces/GetTransactionsInput';
import UserWithoutPassword from '../../../interfaces/UserWithoutPassword';
import TransactionBody from '../../../interfaces/TransactionBody';

export const userWithPasswordMock: User = {
  id: 'userIdTest',
  username: 'usernameTest',
  password: 'passwordT3st',
  accountId: 'accountIdTest',
};

export const userWithoutPasswordMock: UserWithoutPassword = {
  id: 'userIdTest',
  accountId: 'accountIdTest',
  username: 'usernameTest',
};

export const userCreateWithoutAccountInputMock: Prisma.UserCreateWithoutAccountInput =
  {
    password: 'passwordT3st',
    username: 'usernameTest2',
  };

export const accountMock: Account = {
  id: 'accountIdTest',
  balance: new Prisma.Decimal(100),
};

export const accountMock2: Account = {
  id: 'accountIdTest2',
  balance: new Prisma.Decimal(100),
};

export const creditedAccountMock: Account = {
  ...accountMock,
  balance: new Prisma.Decimal(150),
};

export const userMatchMock: UserMatch = {
  accountId: 'accountIdTest',
  username: 'usernameTest',
};

export const readCreditedTransactionsInputMock: GetTransactionsInput = {
  accountId: 'accountIdTest',
  username: 'usernameTest',
  type: 'cash-in',
};

export const readDebitedTransactionsInputMock: GetTransactionsInput = {
  accountId: 'accountIdTest2',
  username: 'usernameTest2',
  type: 'cash-out',
  orderBy: 'desc',
};

export const transactionBodyMock: TransactionBody = {
  creditedUsername: 'usernameTest',
  debitedUsername: 'usernameTest2',
  value: new Prisma.Decimal(50),
};

export const makeTransactionInputMock: TransactionInput = {
  creditedAccountId: 'accountIdTest',
  debitedAccountId: 'accountIdTest2',
  debitedUsername: 'usernameTest2',
  value: new Prisma.Decimal(50),
};

export const transactionsMock: (Transaction & {
  debitedAccount: { user: { username: string } };
  creditedAccount: { user: { username: string } };
})[] = [
  {
    id: 'transactionIdTest',
    creditedAccountId: 'accountIdTest2',
    debitedAccountId: 'accountIdTest',
    value: new Prisma.Decimal(50),
    createdAt: new Date(),
    creditedAccount: { user: { username: 'usernameTest2' } },
    debitedAccount: { user: { username: 'usernameTest' } },
  },
  {
    id: 'transactionIdTest2',
    creditedAccountId: 'accountIdTest',
    debitedAccountId: 'accountIdTest2',
    value: new Prisma.Decimal(30),
    createdAt: new Date(),
    creditedAccount: { user: { username: 'usernameTest' } },
    debitedAccount: { user: { username: 'usernameTest2' } },
  },
  {
    id: 'transactionIdTest3',
    creditedAccountId: 'accountIdTest2',
    debitedAccountId: 'accountIdTest',
    value: new Prisma.Decimal(65),
    createdAt: new Date(),
    creditedAccount: { user: { username: 'usernameTest2' } },
    debitedAccount: { user: { username: 'usernameTest' } },
  },
];

export const invalidTransactionMock = {
  creditedUsername: 'invalidTransaction',
  debitedUsername: 'invalidTransaction',
  value: new Prisma.Decimal(50),
};

export const invalidUserMock = {
  password: 'invalidPassword',
  username: 'invalidUsername',
};
