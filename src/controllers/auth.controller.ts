import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import LocalAuthGuard from 'src/guards/local-auth.guard';
import AuthService from 'src/services/auth.service';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
