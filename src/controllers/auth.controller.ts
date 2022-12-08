import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import LocalAuthGuard from 'src/guards/local-auth.guard';
import { UserSchema, UserType } from 'src/schema/UserSchema';
import AuthService from 'src/services/auth.service';

@Controller()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() user: User) {
    return this.authService.login(user);
  }

  @Post('/register')
  async register(@Body() user: UserType) {
    const parsed = UserSchema.safeParse(user);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues[0].message);
    }

    return this.authService.register(user);
  }
}
