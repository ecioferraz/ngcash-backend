import { Module } from '@nestjs/common';
import UsersController from '../controllers/users.controller';
import PasswordProvider from '../providers/PasswordProvider';
import AccountsService from '../services/accounts.service';
import PrismaService from '../services/prisma.service';
import UsersService from '../services/users.service';

@Module({
  providers: [PasswordProvider, AccountsService, UsersService, PrismaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export default class UsersModule {}
