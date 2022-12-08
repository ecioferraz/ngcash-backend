import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Account } from '@prisma/client';
import UserMatch from 'src/interfaces/UserMatch';
import PrismaService from './prisma.service';

@Injectable()
export default class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create() {
    return this.prisma.account.create({ data: {} });
  }

  async read() {
    return this.prisma.account.findMany();
  }

  async readOne(id: string) {
    return this.prisma.account.findUnique({ where: { id } });
  }

  async readBalance(user: UserMatch) {
    const { id, username } = user;

    const account = await this.prisma.account.findFirst({
      where: { id, user: { username } },
    });

    if (!account) throw new UnauthorizedException('Unauthorized user');

    return account?.balance;
  }

  async delete(id: Account['id']) {
    return this.prisma.account.delete({ where: { id } });
  }
}
