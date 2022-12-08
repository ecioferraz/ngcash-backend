import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const account = await this.prisma.account.findUnique({ where: { id } });

    if (!account) throw new NotFoundException('Account not found');

    return account;
  }

  async readBalance(user: UserMatch) {
    const { id, username } = user;

    if (!id || !username) {
      throw new BadRequestException('Missing account id or username');
    }

    const account = await this.prisma.account.findFirst({
      where: { id, user: { username } },
    });

    if (!account) throw new UnauthorizedException('Unauthorized user');

    return account?.balance;
  }

  async delete(id: Account['id']) {
    return this.prisma.account.delete({ where: { id } }).catch(() => {
      throw new NotFoundException('Account not found');
    });
  }
}
