import { Prisma } from '@prisma/client';

export const userWWithPasswordMock = {
  accountId: 'accountIdTest',
  id: 'idTest',
  password: 'passwordTest',
  username: 'usernameTest',
};

export const userWWithoutPasswordMock = {
  accountId: 'accountIdTest',
  id: 'idTest',
  username: 'usernameTest',
};

export const userCreateWithoutAccountInputMock = {
  password: 'passwordTest',
  username: 'usernameTest2',
};

export const newAccountMock = {
  id: 'testId',
  balance: new Prisma.Decimal(100),
};
