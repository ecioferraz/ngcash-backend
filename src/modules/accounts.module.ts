import { Module } from '@nestjs/common';
import AccountsController from '../controllers/accounts.controller';
import AccountsService from '../services/accounts.service';
import PrismaService from '../services/prisma.service';

@Module({
  providers: [AccountsService, PrismaService],
  exports: [AccountsService],
  controllers: [AccountsController],
})
export default class AccountsModule {}
