import { Module } from '@nestjs/common';
import AccountsController from 'src/controllers/accounts.controller';
import AccountsService from 'src/services/accounts.service';
import PrismaService from 'src/services/prisma.service';

@Module({
  providers: [AccountsService, PrismaService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export default class AccountsModule {}
