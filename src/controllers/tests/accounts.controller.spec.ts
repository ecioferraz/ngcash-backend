import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import AccountsController from '../accounts.controller';
import AccountsService from '../../services/accounts.service';
import PrismaService from '../../services/prisma.service';
import {
  accountMock,
  accountMock2,
  userMatchMock,
} from '../../services/tests/mocks';

describe('AccountsController', () => {
  let accountsController: AccountsController;
  let accountsService: DeepMockProxy<AccountsService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [AccountsService, PrismaService],
    })
      .overrideProvider(AccountsService)
      .useValue(mockDeep<AccountsService>())
      .compile();

    accountsController = module.get(AccountsController);
    accountsService = module.get(AccountsService);
  });

  const { balance } = accountMock;

  describe('create', () => {
    it('should return a newly created account', async () => {
      accountsService.create.mockResolvedValueOnce(accountMock);

      expect(await accountsController.create()).toStrictEqual(accountMock);
    });
  });

  describe('read', () => {
    it('should return a list of accounts', async () => {
      accountsService.read.mockResolvedValueOnce([accountMock, accountMock2]);

      expect(await accountsController.read()).toStrictEqual([
        accountMock,
        accountMock2,
      ]);
    });
  });

  describe('readBalance', () => {
    it("should return a user's balance", async () => {
      accountsService.readBalance.mockResolvedValue(balance);

      expect(await accountsController.readBalance(userMatchMock)).toStrictEqual(
        balance,
      );
    });
  });
});
