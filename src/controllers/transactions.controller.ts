import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Account, Transaction, User } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import TransactionsService from 'src/services/transactions.service';
import CashInCashOut from 'src/types/CashInCashOut';
import OrderBy from 'src/types/OrderBy';

interface TransactionBody {
  creditedUsername: User['username'];
  debitedUsername: User['username'];
  value: Transaction['value'];
}

interface GetTransactionInput {
  accountId: Account['id'];
  orderBy: OrderBy;
  type: CashInCashOut;
}

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export default class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
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

  @Get()
  async read(@Body() getTransactionInput: GetTransactionInput) {
    const { accountId, orderBy, type } = getTransactionInput;

    return this.transactionsService.read(accountId, orderBy, type);
  }

  @Delete()
  async delete() {
    return this.transactionsService.delete();
  }
}
