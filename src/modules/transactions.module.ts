import { Module } from '@nestjs/common';
import TransactionsController from 'src/controllers/transactions.controller';
import PasswordProvider from 'src/providers/PasswordProvider';
import AccountsService from 'src/services/accounts.service';
import PrismaService from 'src/services/prisma.service';
import TransactionsService from 'src/services/transactions.service';
import UsersService from 'src/services/users.service';

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
