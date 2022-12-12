import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import TransactionInput from 'src/interfaces/TransactionInput';
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

  // probably refactor everything. may need to get whole user infos in order to make transactions

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

  async read() {
    return this.prisma.transaction.findMany();
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
