import { Body, Controller, Post } from '@nestjs/common';
import { LoggerService } from '../../common/logger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from '../../domain/dto/auth';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
