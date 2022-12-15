import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_OR_ROUNDS = Math.random() * 10;

@Injectable()
export default class PasswordProvider {
  async hashPassword(password: string) {
    return bcrypt.hashSync(password, SALT_OR_ROUNDS);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
