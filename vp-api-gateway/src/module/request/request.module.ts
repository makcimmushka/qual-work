import { Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { RedisModule } from '../redis';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';

@Module({
  imports: [AuthModule, RedisModule],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [],
})
export class RequestModule {}
