import { Prisma } from '@prisma/client';

export const userWithPasswordMock = {
  accountId: 'accountIdTest',
  id: 'idTest',
  password: 'passwordTest',
  username: 'usernameTest',
};

export const userWithoutPasswordMock = {
  accountId: 'accountIdTest',
  id: 'idTest',
  username: 'usernameTest',
};

export const userCreateWithoutAccountInputMock = {
  password: 'passwordTest',
  username: 'usernameTest2',
};

export const accountMock = {
  id: 'testId',
  balance: new Prisma.Decimal(100),
};

export const creditedAccountMock = {
  ...accountMock,
  balance: new Prisma.Decimal(150),
};
