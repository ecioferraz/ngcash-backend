import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import LoginBody from '../interfaces/LoginBody';
import LocalAuthGuard from '../guards/local-auth.guard';
import { UserSchema, UserType } from '../schema/User.schema';
import AuthService from '../services/auth.service';

@Controller()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Get('/login')
  async login(@Query() user: LoginBody) {
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
