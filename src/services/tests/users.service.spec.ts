import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AccountsService from '../accounts.service';
import PrismaService from '../prisma.service';
import UsersService from '../users.service';
import PasswordProvider from '../../providers/Password.provider';
import {
  accountMock,
  userCreateWithoutAccountInputMock,
  userWithoutPasswordMock,
  userWithPasswordMock,
} from './mocks';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        UsersService,
        PasswordProvider,
        AccountsService,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersService = module.get(UsersService);
    prismaService = module.get(PrismaService);
  });

  const { accountId, id, username } = userWithoutPasswordMock;

  describe('create', () => {
    beforeEach(() => {
      prismaService.user.create.mockResolvedValue(userWithPasswordMock);
      prismaService.account.create.mockResolvedValue(accountMock);
    });

    it('should return a newly created user', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      expect(
        await usersService.create(userCreateWithoutAccountInputMock),
      ).toStrictEqual(userWithoutPasswordMock);
    });

    it('should throw a ConflictException', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userWithPasswordMock);

      await expect(
        usersService.create(userCreateWithoutAccountInputMock),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('readOne', () => {
    it('should return a user without their password', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(userWithPasswordMock);

      expect(await usersService.readOne({ id })).toStrictEqual(
        userWithoutPasswordMock,
      );
    });

    it('should throw an NotFoundException', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        usersService.readOne({ id: 'invalidId' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('getAccountId', () => {
    it("should return a required user's account", async () => {
      prismaService.user.findUnique.mockResolvedValueOnce({
        accountId,
      } as User);

      expect(await usersService.getAccountId({ username })).toStrictEqual({
        accountId,
      });
    });
  });

  describe('read', () => {
    it('should return all registered users', async () => {
      prismaService.user.findMany.mockResolvedValueOnce([userWithPasswordMock]);

      expect(await usersService.read()).toStrictEqual([
        userWithoutPasswordMock,
      ]);
    });
  });
});
