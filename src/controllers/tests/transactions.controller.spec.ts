import { Test } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import TransactionsController from '../transactions.controller';
import AccountsService from '../../services/accounts.service';
import PrismaService from '../../services/prisma.service';
import UsersService from '../../services/users.service';
import TransactionsService from '../../services/transactions.service';
import PasswordProvider from '../../providers/Password.provider';
import {
  invalidTransactionMock,
  makeTransactionInputMock,
  transactionBodyMock,
  transactionsMock,
  userMatchMock,
} from '../../services/tests/mocks';
import { BadRequestException } from '@nestjs/common';

const { creditedAccountId, debitedAccountId } = makeTransactionInputMock;

describe('TransactionsController', () => {
  let transactionsController: TransactionsController;
  let transactionsService: DeepMockProxy<TransactionsService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        UsersService,
        AccountsService,
        PasswordProvider,
        PrismaService,
      ],
    })
      .overrideProvider(TransactionsService)
      .useValue(mockDeep<TransactionsService>())
      .compile();

    transactionsController = module.get(TransactionsController);
    transactionsService = module.get(TransactionsService);
  });

  describe('create', () => {
    it('should return a newly created account', async () => {
      transactionsService.getAccountIds.mockResolvedValueOnce([
        { accountId: creditedAccountId },
        { accountId: debitedAccountId },
      ]);
      transactionsService.makeTransaction.mockResolvedValueOnce(
        transactionsMock[0],
      );

      expect(
        await transactionsController.create(transactionBodyMock),
      ).toStrictEqual(transactionsMock[0]);
    });

    it('should throw a BadRequestException when a user tries to make a transaction to their own account', async () => {
      await expect(
        transactionsController.create(invalidTransactionMock),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('read', () => {
    it('should return a list of all transactions from a user', async () => {
      transactionsService.read.mockResolvedValueOnce(transactionsMock);

      expect(await transactionsController.read(userMatchMock)).toStrictEqual(
        transactionsMock,
      );
    });
  });
});
