import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import PrismaService from './prisma.service';

@Injectable()
export default class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(balance = 100) {
    return this.prisma.account.create({ data: { balance } });
  }

  async read() {
    return this.prisma.account.findMany();
  }

  async readOne(accountId: string) {
    const account = await this.prisma.user.findUnique({ where: { accountId } });

    return account;
  }

  async delete(id: Account['id']) {
    return this.prisma.account.deleteMany({ where: { id } });
  }
}
