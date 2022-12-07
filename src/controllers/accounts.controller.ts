import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import JwtAuthGuard from 'src/guards/jwt-auth.guard';
import AccountsService from 'src/services/accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Body() account: { balance: number }) {
    const { balance } = account;

    return this.accountsService.create(balance);
  }

  @Get()
  async getAll() {
    return this.accountsService.read();
  }

  @Get('/:id')
  async readOne(@Param('id') id: Account['id']) {
    return this.accountsService.readOne(id);
  }

  @Delete('/:id')
  async delete(@Param('id') id: Account['id']) {
    return this.accountsService.delete(id);
  }
}
