import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync('jwt.evaluation.key', 'utf-8'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
