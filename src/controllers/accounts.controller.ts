import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import UserMatch from '../interfaces/UserMatch';
import AccountsService from '../services/accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export default class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create() {
    return this.accountsService.create();
  }

  @Get()
  async read() {
    return this.accountsService.read();
  }

  @Get('/balance')
  async readBalance(@Query() user: UserMatch) {
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
