import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Transaction, User } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import TransactionsService from 'src/services/transactions.service';

interface TransactionBody {
  creditedUsername: User['username'];
  debitedUsername: User['username'];
  value: Transaction['value'];
}

// match transactions with creditedAccountId and debitedAccountId for cash-in and cash-out respectively

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export default class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/cash-in')
  async create(@Body() transactionInput: TransactionBody) {
    const { creditedUsername, debitedUsername, value } = transactionInput;

    if (creditedUsername === debitedUsername) {
      throw new BadRequestException('Cannot credit your own account');
    }

    const [creditedAccountId, debitedAccountId] =
      await this.transactionsService.getAccountIds([
        creditedUsername,
        debitedUsername,
      ]);

    return this.transactionsService.makeTransaction({
      creditedAccountId: creditedAccountId?.accountId as string,
      debitedAccountId: debitedAccountId?.accountId as string,
      debitedUsername,
      value,
    });
  }

  @Get('/cash-in')
  async read() {
    return this.transactionsService.read();
  }

  @Delete('/cash-in')
  async delete() {
    return this.transactionsService.delete();
  }
}
