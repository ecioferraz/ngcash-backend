import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AccountsService from '../accounts.service';
import PrismaService from '../prisma.service';
import UserMatch from '../../interfaces/UserMatch';
import {
  accountMock,
  accountMock2,
  creditedAccountMock,
  userWithoutPasswordMock,
} from './mocks';

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

  const { username } = userWithoutPasswordMock;
  const { balance, id } = accountMock;
  const { id: id2 } = accountMock2;

  describe('readOne', () => {
    it('should return the account required', async () => {
      prismaService.account.findUnique.mockResolvedValueOnce(accountMock);

      expect(await accountsService.readOne(id)).toStrictEqual(accountMock);
    });

    it('should throw a NotFoundException when id is invalid', async () => {
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
        await accountsService.matchUser({
          accountId: id,
          username,
        } as UserMatch),
      ).toStrictEqual(accountMock);
    });

    it('should throw a BadRequestException when missing account id or username', async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(null);

      await expect(
        accountsService.matchUser({ username } as UserMatch),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw a UnauthorizedException when username and accountId are not from the same user', async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(null);

      await expect(
        accountsService.matchUser({
          username,
          accountId: id2,
        } as UserMatch),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('checkAvailableBalance', () => {
    it("should throw a BadRequestException when an account's balance is lower than the value of the transaction", async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

      await expect(
        accountsService.checkAvailableBalance(
          id,
          username as UserMatch['username'],
          new Prisma.Decimal(1000),
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('readBalance', () => {
    it("should return an account's balance", async () => {
      prismaService.account.findFirst.mockResolvedValueOnce(accountMock);

      expect(
        await accountsService.readBalance({
          accountId: id,
          username,
        } as UserMatch),
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
