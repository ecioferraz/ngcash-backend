import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import TransactionBody from '../interfaces/TransactionBody';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import GetTransactionsInput from '../interfaces/GetTransactionsInput';
import TransactionsService from '../services/transactions.service';
import ExceptionMessages from 'src/interfaces/ExceptionMessages';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export default class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() transactionInput: TransactionBody) {
    const { creditedUsername, debitedUsername, value } = transactionInput;

    if (creditedUsername === debitedUsername) {
      throw new BadRequestException(ExceptionMessages.sameAccount);
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
  async read(@Query() getTransactionsInput: GetTransactionsInput) {
    return this.transactionsService.read(getTransactionsInput);
  }

  @Delete()
  async delete() {
    return this.transactionsService.delete();
  }
}
