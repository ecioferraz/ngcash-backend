import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Transaction, User } from '@prisma/client';
import AccountsService from './accounts.service';
import PrismaService from './prisma.service';
import UsersService from './users.service';

interface TransactionInput {
  creditedAccount: User['username'];
  debitedAccount: User['username'];
  value: Transaction['value'];
}

@Injectable()
export default class TransactionsService {
  constructor(
    private accountService: AccountsService,
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  // probably refactor everything. may need to get whole user infos in order to make transactions

  private async getAccountIds(usernames: User['username'][]) {
    const accountIds = await Promise.all(
      usernames.map(async (username) =>
        this.usersService.getAccountId({ username }),
      ),
    );

    if (accountIds.length !== 2)
      throw new NotFoundException(
        'One of the users could not be found, try again.',
      );

    return accountIds;
  }

  private async create(transaction: Prisma.TransactionUncheckedCreateInput) {
    await this.prisma.transaction.create({ data: transaction });
  }

  async cashIn(transaction: TransactionInput) {
    const { creditedAccount, debitedAccount, value } = transaction;

    const [creditedUser, debitedUser] = await this.getAccountIds([
      creditedAccount,
      debitedAccount,
    ]);

    await this.create({
      creditedAccountId: creditedUser?.accountId as string,
      debitedAccountId: debitedUser?.accountId as string,
      value,
    });

    // await this.accountService.
  }
}
