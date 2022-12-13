import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import UserWithoutPassword from '../interfaces/UserWithoutPassword';
import PasswordProvider from '../providers/PasswordProvider';
import AccountsService from './accounts.service';
import PrismaService from './prisma.service';

@Injectable()
export default class UsersService {
  constructor(
    private accountsService: AccountsService,
    private prisma: PrismaService,
    private passwordProvider: PasswordProvider,
  ) {}

  async readOne(user: Prisma.UserWhereUniqueInput) {
    const userFound: UserWithoutPassword | null =
      await this.prisma.user.findUnique({ where: user });

    if (!userFound) throw new NotFoundException('User not found');

    delete userFound.password;

    return userFound as User;
  }

  async findOne(user: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where: user });
  }

  async create(user: Prisma.UserCreateWithoutAccountInput) {
    const { password, username } = user;

    const userExists = await this.findOne({ username });

    if (userExists) throw new ConflictException('User already exists');

    const hashedPassword = await this.passwordProvider.hashPassword(password);

    const { id: accountId } = await this.accountsService.create();

    const newUser: UserWithoutPassword = await this.prisma.user.create({
      data: { username, password: hashedPassword, accountId },
    });

    delete newUser.password;

    return newUser as User;
  }

  async getAccountId(user: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: user,
      select: { accountId: true },
    });
  }

  async read() {
    return this.prisma.user.findMany({
      select: { id: true, username: true, accountId: true },
    });
  }

  async delete(user: Prisma.UserWhereUniqueInput) {
    await this.prisma.user.delete({ where: user }).catch(() => {
      throw new NotFoundException('User not found');
    });
  }
}
