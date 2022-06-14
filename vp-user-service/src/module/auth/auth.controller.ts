import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { LoggerService } from '../../common/logger';
import { ExceptionFilter } from '../../common/exception-filter';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from '../../domain/interface/auth';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionFilter())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @MessagePattern('auth.sign-up')
  public signUp(@Payload() message: Record<string, any>): Observable<any> {
    const signUpDto: SignUpDto = message.value;
    return from(this.authService.signUp(signUpDto));
  }

  @MessagePattern('auth.sign-in')
  public createUser(@Payload() message: Record<string, any>): Observable<any> {
    const signInDto: SignInDto = message.value;
    return from(this.authService.signIn(signInDto));
  }
}
