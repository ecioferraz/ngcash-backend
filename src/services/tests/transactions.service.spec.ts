import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AccountsService from '../accounts.service';
import PrismaService from '../prisma.service';
import TransactionsService from '../transactions.service';
import UsersService from '../users.service';
import PasswordProvider from '../../providers/Password.provider';
import UserMatch from '../../interfaces/UserMatch';
import {
  accountMock,
  accountMock2,
  makeTransactionInputMock,
  readCreditedTransactionsInputMock,
  readDebitedTransactionsInputMock,
  transactionsMock,
  userMatchMock,
  userWithoutPasswordMock,
} from './mocks';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        AccountsService,
        PasswordProvider,
        TransactionsService,
        UsersService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    transactionsService = module.get(TransactionsService);
    prismaService = module.get(PrismaService);
  });

  const { username } = userWithoutPasswordMock;
  const { id: accountId } = accountMock;

  describe('getAccountIds', () => {
    it('should return an array of accountIds', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId,
      } as User);
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId: 'accountIdTest2',
      } as User);

      expect(
        await transactionsService.getAccountIds([
          username as UserMatch['username'],
          'testUsername2',
        ]),
      ).toStrictEqual([{ accountId }, { accountId: 'accountIdTest2' }]);
    });

    it('should throw a NotFoundException when at least one username is invalid', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId,
      } as User);
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        transactionsService.getAccountIds([
          username as UserMatch['username'],
          'invalidUsername',
        ]),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    describe('read', () => {
      it('should return all transactions in descendent order a user participated', async () => {
        prismaService.transaction.findMany.mockResolvedValueOnce(
          transactionsMock,
        );
        prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

        expect(await transactionsService.read(userMatchMock)).toStrictEqual(
          transactionsMock,
        );
      });

      it('should return all credited transactions a user participated', async () => {
        prismaService.transaction.findMany.mockResolvedValueOnce([
          transactionsMock[1],
        ]);
        prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

        expect(
          await transactionsService.read(readCreditedTransactionsInputMock),
        ).toStrictEqual([transactionsMock[1]]);
      });

      it('should return all debited transactions a user participated', async () => {
        prismaService.transaction.findMany.mockResolvedValueOnce([
          transactionsMock[2],
          transactionsMock[0],
        ]);
        prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

        expect(
          await transactionsService.read(readDebitedTransactionsInputMock),
        ).toStrictEqual([transactionsMock[2], transactionsMock[0]]);
      });
    });

    describe('makeTransaction', () => {
      it('should create a new transaction', async () => {
        prismaService.transaction.create.mockResolvedValueOnce(
          transactionsMock[1],
        );
        prismaService.account.findFirst.mockResolvedValueOnce(accountMock);
        prismaService.account.findFirst.mockResolvedValueOnce(accountMock2);

        expect(
          await transactionsService.makeTransaction(makeTransactionInputMock),
        ).toStrictEqual(transactionsMock[1]);
      });
    });
  });
});
