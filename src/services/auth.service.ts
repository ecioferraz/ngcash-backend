import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import UserWithoutPassword from 'src/interfaces/UserWithoutPassword';
import PasswordProvider from 'src/providers/PasswordProvider';
import { UserType } from 'src/schema/UserSchema';
import UsersService from './users.service';
import { JwtService } from '@nestjs/jwt';

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
      await this.usersService.readOne({ username });

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

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };

    return { token: this.jwtService.sign(payload) };
  }

  async register(user: Prisma.UserCreateWithoutAccountInput) {
    return this.usersService.create(user);
  }
}
