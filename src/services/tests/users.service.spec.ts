import { Test, TestingModule } from '@nestjs/testing';
import PrismaService from '../prisma.service';
import UsersService from '../users.service';
import PasswordProvider from '../../providers/PasswordProvider';
import AccountsService from '../accounts.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  newAccountMock,
  userCreateWithoutAccountInputMock,
  userWWithoutPasswordMock,
  userWWithPasswordMock,
} from './mocks';
import { PrismaClient } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';

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

  describe('create', () => {
    beforeEach(() => {
      prismaService.user.create.mockResolvedValue(userWWithPasswordMock);
      prismaService.account.create.mockResolvedValue(newAccountMock);
    });

    it('should return a newly created user', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      expect(
        await usersService.create(userCreateWithoutAccountInputMock),
      ).toStrictEqual(userWWithoutPasswordMock);
    });

    it('should throw a ConflictException', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(
        userWWithPasswordMock,
      );

      await expect(
        usersService.create(userCreateWithoutAccountInputMock),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('readOne', () => {
    it('should return a user without their password', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(
        userWWithPasswordMock,
      );

      expect(
        await usersService.readOne({ id: userWWithoutPasswordMock.id }),
      ).toStrictEqual(userWWithoutPasswordMock);
    });

    it('should throw an NotFoundException', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        usersService.readOne({ id: 'invalidId' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
