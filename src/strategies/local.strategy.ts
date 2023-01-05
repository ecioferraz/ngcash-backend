import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from '../services/auth.service';
import { User } from '@prisma/client';
import ExceptionMessages from 'src/interfaces/ExceptionMessages';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<User> {
    const validUser = await this.authService.validateUser({
      username,
      password,
    });

    if (!validUser) {
      throw new UnauthorizedException(ExceptionMessages.invalidLogin);
    }

    return validUser;
  }
}
