import { Module } from '@nestjs/common';
import PasswordProvider from 'src/providers/PasswordProvider';
import AccountsService from 'src/services/accounts.service';
import PrismaService from 'src/services/prisma.service';
import TransactionsService from 'src/services/transactions.service';
import UsersService from 'src/services/users.service';
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
