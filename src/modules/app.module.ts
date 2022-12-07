import { Module } from '@nestjs/common';
import PasswordProvider from 'src/providers/PasswordProvider';
import AccountsService from 'src/services/accounts.service';
import PrismaService from 'src/services/prisma.service';
import UsersService from 'src/services/users.service';
import AccountsModule from './accounts.module';
import { AuthModule } from './auth.module';
import UsersModule from './users.module';

@Module({
  imports: [UsersModule, AccountsModule, AuthModule],
  controllers: [],
  providers: [PrismaService, UsersService, PasswordProvider, AccountsService],
})
export default class AppModule {}
