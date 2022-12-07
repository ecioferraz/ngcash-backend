import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import UserMatch from 'src/interfaces/UserMatch';
import { UserSchema, UserType } from 'src/schema/UserSchema';
import UsersService from 'src/services/users.service';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(@Body() user: UserType) {
    const parsed = UserSchema.safeParse(user);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.issues[0].message);
    }

    return this.usersService.create(user);
  }

  @Get('/:id')
  async readOne(@Param('id') id: User['id']) {
    return this.usersService.readOne({ id });
  }

  @Get()
  async read() {
    return this.usersService.read();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/balance')
  async readBalance(@Param('id') id: User['id'], @Body() user: UserMatch) {
    return this.usersService.readBalance({ id, username: user.username });
  }

  @Delete('/:id')
  async delete(@Param('id') id: User['id']) {
    return this.usersService.delete({ id });
  }
}
