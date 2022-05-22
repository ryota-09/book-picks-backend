import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/db/dto/create-user.dto';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createUser: CreateUserDto) {
    return this.authService.login(createUser);
  }
}
