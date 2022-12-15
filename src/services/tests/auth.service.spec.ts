import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AuthService from '../auth.service';
import PrismaService from '../prisma.service';
import UsersService from '../users.service';
import PasswordProvider from '../../providers/PasswordProvider';
import LocalStrategy from '../../strategies/local.strategy';
import JwtStrategy from '../../strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import AccountsService from '../accounts.service';
import {
  invalidUserMock,
  userCreateWithoutAccountInputMock,
  userWithoutPasswordMock,
  userWithPasswordMock,
} from './mocks';

describe('AuthService', () => {
  let authService: AuthService;
  let passwordProvider: DeepMockProxy<PasswordProvider>;
  let usersService: DeepMockProxy<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        AuthService,
        PrismaService,
        UsersService,
        LocalStrategy,
        JwtService,
        JwtStrategy,
        PasswordProvider,
      ],
    })
      .overrideProvider(PasswordProvider)
      .useValue(mockDeep<PasswordProvider>())
      .overrideProvider(UsersService)
      .useValue(mockDeep<UsersService>())
      .compile();

    authService = module.get(AuthService);
    passwordProvider = module.get(PasswordProvider);
    usersService = module.get(UsersService);
  });

  describe('validateUser', () => {
    it('should validate an user', async () => {
      usersService.findOne.mockResolvedValueOnce(userWithPasswordMock);
      passwordProvider.comparePassword.mockResolvedValueOnce(true);

      expect(
        await authService.validateUser(userCreateWithoutAccountInputMock),
      ).toStrictEqual(userWithoutPasswordMock);
    });

    it('should return null when username or password are not valid', async () => {
      usersService.findOne.mockResolvedValueOnce(null);
      passwordProvider.comparePassword.mockResolvedValueOnce(false);

      expect(await authService.validateUser(invalidUserMock)).toStrictEqual(
        null,
      );
    });
  });

  describe('register', () => {
    it('should return a newly created user', async () => {
      usersService.create.mockResolvedValueOnce(userWithoutPasswordMock);

      expect(await authService.register(userCreateWithoutAccountInputMock)).toStrictEqual(
        userWithoutPasswordMock,
      );
    });
  });
});
