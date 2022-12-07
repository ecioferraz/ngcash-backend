import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import UserMatch from 'src/interfaces/UserMatch';
import UserWithoutPassword from 'src/interfaces/UserWithoutPassword';
import PasswordProvider from 'src/providers/PasswordProvider';
import PrismaService from './prisma.service';

@Injectable()
export default class UsersService {
  constructor(
    private prisma: PrismaService,
    private passwordProvider: PasswordProvider,
  ) {}

  async readOne(user: Prisma.UserWhereUniqueInput) {
    const { id } = user;

    const userFound: UserWithoutPassword | null =
      await this.prisma.user.findUnique({
        where: { id },
      });

    if (!userFound) throw new NotFoundException();

    delete userFound.password;

    return userFound as User;
  }

  async findOne(user: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where: user });
  }

  async create(user: Prisma.UserCreateWithoutAccountInput) {
    const { password, username } = user;

    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.passwordProvider.hashPassword(password);

    const { id: accountId } = await this.prisma.account.create({
      data: { balance: 100 },
    });

    const newUser: UserWithoutPassword = await this.prisma.user.create({
      data: { username, password: hashedPassword, accountId },
    });

    delete newUser.password;

    return newUser as User;
  }

  async readBalance(user: UserMatch) {
    const matchedUser = await this.prisma.user.findFirst({
      where: user,
      include: { account: true },
    });

    if (!matchedUser) throw new UnauthorizedException('Unauthorized user');

    return matchedUser.account.balance;
  }

  async read() {
    return await this.prisma.user.findMany();
  }

  async delete(user: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where: user });
  }
}