import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Account, Transaction, User } from '@prisma/client';
import UserMatch from 'src/interfaces/UserMatch';
import PrismaService from './prisma.service';

interface CreditDebitInput {
  id: string;
  value: Transaction['value'];
}
@Injectable()
export default class AccountsService {
  constructor(private prisma: PrismaService) {}

  async checkAvailableBalance(
    accountId: Account['id'],
    username: User['username'],
    value: Account['balance'],
  ) {
    const balance = await this.readBalance({ accountId, username });

    if (balance < value) {
      throw new BadRequestException(
        "You don't have enough balance to complete this transaction",
      );
    }
  }

  async create() {
    return this.prisma.account.create({ data: {} });
  }

  async read() {
    return this.prisma.account.findMany();
  }

  async readOne(id: Account['id']) {
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) throw new NotFoundException('Account not found');

    return account;
  }

  async readBalance(user: UserMatch) {
    const { accountId: id, username } = user;

    if (!id || !username) {
      throw new BadRequestException('Missing account id or username');
    }

    const account = await this.prisma.account.findFirst({
      where: { id, user: { username } },
    });

    if (!account) throw new UnauthorizedException('Unauthorized user');

    return account?.balance;
  }

  async creditAccount({ id, value }: CreditDebitInput) {
    return this.prisma.account.update({
      data: { balance: { increment: value } },
      where: { id },
    });
  }

  async debitAccount({ id, value }: CreditDebitInput) {
    return this.prisma.account.update({
      data: { balance: { decrement: value } },
      where: { id },
    });
  }

  async delete(id: Account['id']) {
    return this.prisma.account.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Account not found');
    });
  }
}
