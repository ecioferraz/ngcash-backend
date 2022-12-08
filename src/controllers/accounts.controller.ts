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
import UserMatch from 'src/interfaces/UserMatch';
import AccountsService from 'src/services/accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create() {
    return this.accountsService.create();
  }

  @Get()
  async getAll() {
    return this.accountsService.read();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/balance')
  async readBalance(@Body() user: UserMatch) {
    return this.accountsService.readBalance(user);
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
