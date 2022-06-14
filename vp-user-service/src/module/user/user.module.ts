import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity';
import { HelperModule } from '../helper';
import { RedisModule } from '../redis';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HelperModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
