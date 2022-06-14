import {
  ClassSerializerInterceptor,
  Controller,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto } from '../../domain/interface/user';
import { ExceptionFilter } from '../../common/exception-filter';
import { LoggerService } from '../../common/logger';
import { UserService } from './user.service';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new ExceptionFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UserController.name);
  }

  @MessagePattern('user.get')
  public getUser(@Payload() message: Record<string, any>): Observable<any> {
    const userId: string = message.value.userId;
    return from(this.userService.getUser(userId));
  }

  @MessagePattern('user.create')
  public createUser(@Payload() message: Record<string, any>): Observable<any> {
    const createUserDto: CreateUserDto = message.value;
    return from(this.userService.createUser(createUserDto));
  }

  @MessagePattern('user.update')
  public updateUser(@Payload() message: Record<string, any>): Observable<any> {
    const updateUserDto: UpdateUserDto = message.value;
    return from(this.userService.updateUser(updateUserDto));
  }

  @MessagePattern('user.delete')
  public deleteUser(@Payload() message: Record<string, any>): Observable<any> {
    const userId: string = message.value.userId;
    return from(this.userService.deleteUser(userId));
  }
}
