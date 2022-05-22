import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { DbService } from 'src/db/db.service';
import { CreateUserDto } from 'src/db/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DbService,
  ) {}

  async validate({ email, password }: CreateUserDto) {
    const user = await this.dbService.getUserByEmail(email);
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('パスワードが間違っています！');
    }
    return isValid;
  }

  async login(user: CreateUserDto) {
    if (await this.validate(user)) {
      const payload = { email: user.email, password: user.password };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
