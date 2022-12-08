import { Module } from '@nestjs/common';
import UsersController from 'src/controllers/users.controller';
import PasswordProvider from 'src/providers/PasswordProvider';
import AccountsService from 'src/services/accounts.service';
import PrismaService from 'src/services/prisma.service';
import UsersService from 'src/services/users.service';

@Module({
  providers: [PasswordProvider, AccountsService, UsersService, PrismaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export default class UsersModule {}
