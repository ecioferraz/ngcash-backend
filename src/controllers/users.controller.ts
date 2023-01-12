import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import UsersService from '../services/users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  async readOne(@Param('id') id: User['id']) {
    return this.usersService.readOne({ id });
  }

  @Get()
  async read() {
    return this.usersService.read();
  }

  @Delete('/:id')
  async delete(@Param('id') id: User['id']) {
    return this.usersService.delete({ id });
  }
}
