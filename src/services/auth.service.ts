import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import UserWithoutPassword from '../interfaces/UserWithoutPassword';
import PasswordProvider from '../providers/Password.provider';
import { UserType } from '../schema/User.schema';
import UsersService from './users.service';
import { JwtService } from '@nestjs/jwt';
import LoginBody from '../interfaces/LoginBody';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    private passwordProvider: PasswordProvider,
    private usersService: UsersService,
  ) {}

  private async validatePassword(password: string, hashedPassword = '') {
    return this.passwordProvider.comparePassword(password, hashedPassword);
  }

  async validateUser(user: UserType): Promise<User | null> {
    const { password, username } = user;

    const userFound: UserWithoutPassword | null =
      await this.usersService.findOne({ username });

    const isPasswordValid = await this.validatePassword(
      password,
      userFound?.password,
    );

    if (userFound && isPasswordValid) {
      delete userFound.password;

      return userFound as User;
    }

    return null;
  }

  async login({ username }: LoginBody) {
    const user = await this.usersService.readOne({ username });

    return { ...user, token: this.jwtService.sign(user) };
  }

  async register(user: Prisma.UserCreateWithoutAccountInput) {
    const newUser = await this.usersService.create(user);
    return { ...newUser, token: this.jwtService.sign(user) }
  }
}
