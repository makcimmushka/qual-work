import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { RedisModule } from '../redis';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
