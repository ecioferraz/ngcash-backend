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

describe('AccountsService', () => {
  let accountsService: AccountsService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, AccountsService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    accountsService = module.get(AccountsService);
    prismaService = module.get(PrismaService);
  });

  const { accountId, username } = userWithoutPasswordMock;
  const { balance, id } = accountMock;

  describe('readOne', () => {
    it('should return the account required', async () => {
      prismaService.account.findUnique.mockResolvedValueOnce(accountMock);

      expect(await accountsService.readOne(id)).toStrictEqual(accountMock);
    });

    it('should throw an NotFoundException', async () => {
      prismaService.account.findUnique.mockResolvedValueOnce(null);

      await expect(accountsService.readOne('invalidId')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('matchUser', () => {
    it('should return the required account', async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

      expect(
        await accountsService.matchUser({ accountId: id, username }),
      ).toStrictEqual(accountMock);
    });

    it('should throw a BadRequestException when missing account id or username', async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(null);

      await expect(
        accountsService.matchUser({ username } as UserMatch),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('checkAvailableBalance', () => {
    it("should throw a BadRequestException when an account's balance is lower than the value of the transaction", async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

      await expect(
        accountsService.checkAvailableBalance(
          id,
          username,
          new Prisma.Decimal(1000),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('readBalance', () => {
    it("should return an account's balance", async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

      expect(
        await accountsService.readBalance({ accountId: id, username }),
      ).toStrictEqual(balance);
    });
  });

  describe('creditAccount', () => {
    it('should credit an account', async () => {
      prismaService.account.update.mockResolvedValueOnce(creditedAccountMock);

      expect(
        await accountsService.creditAccount({
          id,
          value: new Prisma.Decimal(50),
        }),
      ).toStrictEqual(creditedAccountMock);
    });
  });

  describe('debitAccount', () => {
    it('should debit an account', async () => {
      prismaService.account.update.mockResolvedValueOnce(accountMock);

      expect(
        await accountsService.debitAccount({
          id,
          value: new Prisma.Decimal(50),
        }),
      ).toStrictEqual(accountMock);
    });
  });
});
