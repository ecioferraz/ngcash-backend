import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AuthController from '../auth.controller';
import PasswordProvider from '../../providers/Password.provider';
import AuthService from '../../services/auth.service';
import LocalStrategy from '../../strategies/local.strategy';
import JwtStrategy from '../../strategies/jwt.strategy';
import {
  userCreateWithoutAccountInputMock,
  userWithoutPasswordMock,
} from '../../services/tests/mocks';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, LocalStrategy, JwtStrategy, PasswordProvider],
    })
      .overrideProvider(AuthService)
      .useValue(mockDeep<AuthService>())
      .compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should return a token', async () => {
      authService.login.mockResolvedValueOnce({
        ...userWithoutPasswordMock,
        token: 'token',
      });

      expect(
        await authController.login(userCreateWithoutAccountInputMock),
      ).toStrictEqual({ ...userWithoutPasswordMock, token: 'token' });
    });
  });

  describe('register', () => {
    it('should return a newly created user', async () => {
      authService.register.mockResolvedValueOnce(userWithoutPasswordMock);

      expect(
        await authController.register(userCreateWithoutAccountInputMock),
      ).toStrictEqual(userWithoutPasswordMock);
    });

    it('should throw a BadRequestException when data is invalid', async () => {
      await expect(
        authController.register({ password: 'invalid', username: '' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
