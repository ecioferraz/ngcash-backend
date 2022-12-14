import { Test, TestingModule } from '@nestjs/testing';
import PrismaService from '../prisma.service';
import AccountsService from '../accounts.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  accountMock,
  creditedAccountMock,
  userWithoutPasswordMock,
} from './mocks';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import UserMatch from 'src/interfaces/UserMatch';
import PasswordProvider from '../../providers/PasswordProvider';
import TransactionsService from '../transactions.service';
import UsersService from '../users.service';

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

  const { accountId, username } = userWithoutPasswordMock;
  const { balance, id } = accountMock;

  describe('getAccountIds', () => {
    it('should return an array of accountIds', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId: id,
      } as User);
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId: 'accountIdTest2',
      } as User);

      expect(
        await transactionsService.getAccountIds([username, 'testUsername2']),
      ).toStrictEqual([{ accountId: id }, { accountId: 'accountIdTest2' }]);
    });

    it('should throw a NotFoundException when at least one username is invalid', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId: id,
      } as User);
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        transactionsService.getAccountIds([username, 'invalidUsername']),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
    
    // to be finish
    describe('create', () => {
      it('should create a new transaction', () => {
        prismaService.transaction.create.mockResolvedValueOnce({
          id,
          creditedAccountId: 'idTest2',
          debitedAccountId: id,
          value: new Prisma.Decimal(50),
          createdAt: new Date(),
        });
      });
    });

    // describe('matchUser', () => {
    //   it('should return the required account', async () => {
    //     prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

    //     expect(
    //       await transactionsService.matchUser({ accountId: id, username }),
    //     ).toStrictEqual(accountMock);
    //   });

    //   it('should throw a BadRequestException when missing account id or username', async () => {
    //     prismaService.account.findFirst.mockResolvedValueOnce(null);

    //     await expect(
    //       transactionsService.matchUser({ username } as UserMatch),
    //     ).rejects.toBeInstanceOf(BadRequestException);
    //   });
    // });

    // describe('checkAvailableBalance', () => {
    //   it("should throw a BadRequestException when an account's balance is lower than the value of the transaction", async () => {
    //     prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

    //     await expect(
    //       transactionsService.checkAvailableBalance(
    //         id,
    //         username,
    //         new Prisma.Decimal(1000),
    //       ),
    //     ).rejects.toBeInstanceOf(BadRequestException);
    //   });
    // });

    // describe('readBalance', () => {
    //   it("should return an account's balance", async () => {
    //     prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

    //     expect(
    //       await transactionsService.readBalance({ accountId: id, username }),
    //     ).toStrictEqual(balance);
    //   });
    // });

    // describe('creditAccount', () => {
    //   it('should credit an account', async () => {
    //     prismaService.account.update.mockResolvedValueOnce(creditedAccountMock);

    //     expect(
    //       await transactionsService.creditAccount({
    //         id,
    //         value: new Prisma.Decimal(50),
    //       }),
    //     ).toStrictEqual(creditedAccountMock);
    //   });
    // });

    // describe('debitAccount', () => {
    //   it('should debit an account', async () => {
    //     prismaService.account.update.mockResolvedValueOnce(accountMock);

    //     expect(
    //       await transactionsService.debitAccount({
    //         id,
    //         value: new Prisma.Decimal(50),
    //       }),
    //     ).toStrictEqual(accountMock);
    //   });
    // });
  });
});
