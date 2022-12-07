import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
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
  async getUser(@Param('id') id: User['id']) {
    return this.usersService.getById({ id });
  }

  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  @Delete('/:id')
  async delete(@Param('id') id: User['id']) {
    return this.usersService.delete({ id });
  }
}
