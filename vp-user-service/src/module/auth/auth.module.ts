import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity';
import { HelperModule } from '../helper';
import { RedisModule } from '../redis';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Module({
  imports: [HelperModule, RedisModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [],
})
export class AuthModule {}
