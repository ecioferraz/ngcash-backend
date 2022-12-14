import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import UsersController from '../users.controller';
import PasswordProvider from '../../providers/PasswordProvider';
import AccountsService from '../../services/accounts.service';
import PrismaService from '../../services/prisma.service';
import UsersService from '../../services/users.service';
import { userWithoutPasswordMock } from '../../services/tests/mocks';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: DeepMockProxy<UsersService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PasswordProvider,
        AccountsService,
        UsersService,
        PrismaService,
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockDeep<UsersService>())
      .compile();

    usersController = module.get(UsersController);
    usersService = module.get(UsersService);
  });

  describe('read', () => {
    it('should return all users all registered users', async () => {
      usersService.read.mockResolvedValueOnce([userWithoutPasswordMock]);
  
      expect(await usersController.read()).toStrictEqual([
        userWithoutPasswordMock,
      ]);
    });
  });

  describe('readOne', () => {
    it('should read one', async () => {
      const { id } = userWithoutPasswordMock;
  
      usersService.readOne.mockResolvedValueOnce(userWithoutPasswordMock);
  
      expect(await usersController.readOne(id)).toStrictEqual(userWithoutPasswordMock);
    });
  })
});
