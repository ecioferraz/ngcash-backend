import { Controller, Get, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import TransactionsService from 'src/services/transactions.service';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export default class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/cash-in')
  async read() {
    return this.transactionsService.cashIn({
      creditedAccount: 'eferraz_',
      debitedAccount: 'eferraz',
      value: new Prisma.Decimal(50),
    });
  }
}
