import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from '../../domain/enum';
import { Roles } from '../../common/decorator';
import { AuthGuard } from '../../common/guard';
import { CreateUserDto, UpdateUserDto } from '../../domain/dto/user';
import { UserService } from './user.service';

@Controller()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @Roles(Role.Admin, Role.User, Role.Volunteer)
  public getUser(
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Observable<any> {
    return this.userService.getUser(userId);
  }

  @Post('user')
  @Roles(Role.Admin)
  public createUser(@Body() createUserDto: CreateUserDto): Observable<any> {
    return this.userService.createUser(createUserDto);
  }

  @Put('user')
  @Roles(Role.Admin, Role.User, Role.Volunteer)
  public updateUser(@Body() updateUserDto: UpdateUserDto): Observable<any> {
    return this.userService.updateUser(updateUserDto);
  }

  @Delete('user')
  @Roles(Role.Admin)
  public deleteUser(
    @Query('userId', ParseUUIDPipe) userId: string,
  ): Observable<any> {
    return this.userService.deleteUser(userId);
  }
}
