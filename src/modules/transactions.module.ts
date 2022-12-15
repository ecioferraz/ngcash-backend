import { Module } from '@nestjs/common';
import TransactionsController from '../controllers/transactions.controller';
import PasswordProvider from '../providers/Password.provider';
import AccountsService from '../services/accounts.service';
import PrismaService from '../services/prisma.service';
import TransactionsService from '../services/transactions.service';
import UsersService from '../services/users.service';

@Module({
  providers: [
    TransactionsService,
    UsersService,
    AccountsService,
    PasswordProvider,
    PrismaService,
  ],
  exports: [TransactionsService],
  controllers: [TransactionsController],
})
export default class TransactionsModule {}
