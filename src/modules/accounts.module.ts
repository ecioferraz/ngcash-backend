import { Module } from '@nestjs/common';
import AccountsController from '../controllers/accounts.controller';
import AccountsService from '../services/accounts.service';
import PrismaService from '../services/prisma.service';

@Module({
  controllers: [AccountsController],
  exports: [AccountsService],
  providers: [AccountsService, PrismaService],
})
export default class AccountsModule {}
