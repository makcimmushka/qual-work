import {
  RpcException,
  Transport,
  EventPattern,
  Payload,
} from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestEntity } from '../../domain/entity';
import { Repository } from 'typeorm';
import { Client, ClientKafka } from '@nestjs/microservices';
import { LoggerService } from '../../common/logger';
import { CreateRequestDto, UpdateRequestDto } from '../../domain/interface';
import { Role } from '../../domain/enum';

@Injectable()
export class RequestService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'vp-request-service',
        brokers: [`localhost:9092`],
      },
      consumer: {
        groupId: 'vp-request-service-consumer' + '-' + uuidv4(),
      },
    },
  })
  client: ClientKafka;

  constructor(
    @InjectRepository(RequestEntity)
    private readonly requestsRepository: Repository<RequestEntity>,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(RequestService.name);
  }

  public async getRequest(requestId: string): Promise<any> {
    return this.requestsRepository.findOneBy({ id: requestId });
  }

  public async getAllRequests(): Promise<any> {
    return this.requestsRepository.find();
  }

  public async finishRequest(requestId: string): Promise<any> {
    return this.requestsRepository
      .createQueryBuilder()
      .update({
        isFinished: true,
      })
      .where({
        id: requestId,
      })
      .execute();
  }

  public async assignRequest(
    assignRequestDto: Record<string, any>,
  ): Promise<any> {
    return this.requestsRepository
      .createQueryBuilder()
      .update({
        volunteerId: assignRequestDto.volunteerId,
      })
      .where({
        id: assignRequestDto.requestId,
      })
      .execute();
  }

  public async unassignRequest(
    unassignRequestDto: Record<string, any>,
  ): Promise<any> {
    return this.requestsRepository
      .createQueryBuilder()
      .update({
        volunteerId: null,
      })
      .where({
        id: unassignRequestDto.requestId,
      })
      .execute();
  }

  public async createRequest(createRequestDto: CreateRequestDto): Promise<any> {
    return this.requestsRepository.save(createRequestDto);
  }

  @EventPattern('sync-user.delete')
  public async onUserDelete(
    @Payload() message: Record<string, any>,
  ): Promise<any> {
    const { userId, role } = message.value;
    this.logger.log(
      `received event to delete requests related with ${userId}: ${role}`,
    );
    if (role === Role.Volunteer) {
      await this.requestsRepository
        .createQueryBuilder()
        .update({ volunteerId: null })
        .where({ volunteerId: userId, isFinished: false })
        .execute();
    } else if (role === Role.User) {
      await this.requestsRepository
        .createQueryBuilder()
        .delete()
        .where({ userId, isFinished: false })
        .execute();
    }
  }

  public async updateRequest(updateRequestDto: UpdateRequestDto): Promise<any> {
    const existingRequest = await this.requestsRepository.findOne({
      where: { id: updateRequestDto.id },
    });
    if (!existingRequest) {
      throw new RpcException({
        message: 'Request does not exist',
        status: 404,
      });
    }
    return this.requestsRepository.save(updateRequestDto);
  }

  public async deleteRequest(requestId: string): Promise<any> {
    const existingRequest = await this.requestsRepository.findOne({
      where: { id: requestId },
    });
    if (!existingRequest) {
      throw new RpcException({
        message: 'Request does not exist',
        status: 404,
      });
    }
    return this.requestsRepository.delete(requestId);
  }
}
