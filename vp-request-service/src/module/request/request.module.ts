import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { RequestEntity } from '../../domain/entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestEntity])],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [],
})
export class RequestModule {}
