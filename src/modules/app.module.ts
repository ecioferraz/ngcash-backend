import { Module } from '@nestjs/common';
import PasswordProvider from '../providers/Password.provider';
import AccountsService from '../services/accounts.service';
import PrismaService from '../services/prisma.service';
import TransactionsService from '../services/transactions.service';
import UsersService from '../services/users.service';
import AccountsModule from './accounts.module';
import { AuthModule } from './auth.module';
import TransactionsModule from './transactions.module';
import UsersModule from './users.module';

@Module({
  imports: [UsersModule, AccountsModule, AuthModule, TransactionsModule],
  controllers: [],
  providers: [
    PrismaService,
    UsersService,
    PasswordProvider,
    AccountsService,
    TransactionsService,
  ],
})
export default class AppModule {}
