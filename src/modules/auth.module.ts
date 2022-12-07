import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { PassportModule } from '@nestjs/passport';
import AuthController from 'src/controllers/auth.controller';
import PasswordProvider from 'src/providers/PasswordProvider';
import AuthService from 'src/services/auth.service';
import LocalStrategy from 'src/strategies/local.strategy';
import UsersModule from './users.module';
import JwtStrategy from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: readFileSync('jwt.evaluation.key', 'utf-8'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, PasswordProvider],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
