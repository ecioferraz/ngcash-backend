import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, Prisma, User } from '@prisma/client';
import GetTransactionsInput from 'src/interfaces/GetTransactionsInput';
import TransactionInput from 'src/interfaces/TransactionInput';
import OrderBy from 'src/types/OrderBy';
import AccountsService from './accounts.service';
import PrismaService from './prisma.service';
import UsersService from './users.service';

@Injectable()
export default class TransactionsService {
  constructor(
    private accountsService: AccountsService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async getAccountIds(usernames: User['username'][]) {
    const accountIds = await Promise.all(
      usernames.map(async (username) =>
        this.usersService.getAccountId({ username }),
      ),
    );

    if (accountIds.includes(null)) {
      throw new NotFoundException(
        'One of the users could not be found, try again',
      );
    }

    return accountIds;
  }

  private async create(data: Prisma.TransactionUncheckedCreateInput) {
    return this.prisma.transaction.create({ data });
  }

  private async getCreditedTransactions(id: Account['id'], orderBy: OrderBy) {
    return this.prisma.transaction.findMany({
      where: { creditedAccountId: id },
      orderBy: { createdAt: orderBy },
    });
  }

  private async getDebitedTransactions(id: Account['id'], orderBy: OrderBy) {
    return this.prisma.transaction.findMany({
      where: { debitedAccountId: id },
      orderBy: { createdAt: orderBy },
    });
  }

  private async getAllTransactions(id: Account['id'], orderBy: OrderBy) {
    return this.prisma.transaction.findMany({
      where: { OR: [{ creditedAccountId: id }, { debitedAccountId: id }] },
      orderBy: { createdAt: orderBy },
    });
  }

  async read({
    accountId,
    orderBy = 'desc',
    type = 'all',
    username,
  }: GetTransactionsInput) {
    await this.accountsService.matchUser({ accountId, username });

    if (type === 'cash-in') {
      return this.getCreditedTransactions(accountId, orderBy);
    }

    if (type === 'cash-out') {
      return this.getDebitedTransactions(accountId, orderBy);
    }

    return this.getAllTransactions(accountId, orderBy);
  }

  async makeTransaction(transactionInput: TransactionInput) {
    const { creditedAccountId, debitedAccountId, debitedUsername, value } =
      transactionInput;

    await this.accountsService.checkAvailableBalance(
      debitedAccountId,
      debitedUsername,
      value,
    );

    await this.accountsService.debitAccount({ id: debitedAccountId, value });

    await this.accountsService.creditAccount({ id: creditedAccountId, value });

    return this.create({
      creditedAccountId: creditedAccountId,
      debitedAccountId: debitedAccountId,
      value,
    });
  }

  async delete() {
    return await this.prisma.transaction.deleteMany();
  }
}
