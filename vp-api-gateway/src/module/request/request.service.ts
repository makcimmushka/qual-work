import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { from, map, Observable, mergeMap } from 'rxjs';
import { LoggerService } from '../../common/logger';
import {
  AssignRequestDto,
  CreateRequestDto,
  UpdateRequestDto,
} from '../../domain/dto/request';
import { RedisService } from '../redis';

const TOPIC_NAMES: ReadonlyArray<string> = [
  'request.get',
  'request.create',
  'request.update',
  'request.delete',
  'requests.get',
  'request.finish',
  'request.assign',
  'request.unassign',
];

@Injectable()
export class RequestService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'vp-api-gateway-service',
        brokers: [`localhost:9092`],
      },
      consumer: {
        groupId: 'vp-api-gateway-consumer' + '-' + uuidv4(),
      },
    },
  })
  client: ClientKafka;

  constructor(
    private readonly logger: LoggerService,
    private readonly redis: RedisService,
  ) {
    this.logger.setContext(RequestService.name);
  }

  public async onModuleInit() {
    TOPIC_NAMES.forEach((topicName) =>
      this.client.subscribeToResponseOf(topicName),
    );
    await this.client.connect();
  }

  public getRequest(requestId: string): Observable<any> {
    return this.client
      .send('request.get', { requestId })
      .pipe(map((res) => this.processResponse(res)));
  }

  public getRequests(): Observable<any> {
    return this.client
      .send('requests.get', {})
      .pipe(map((res) => this.processResponse(res)));
  }

  public createRequest(createRequestDto: CreateRequestDto): Observable<any> {
    return from(this.redis.getClient().get(createRequestDto.userId)).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException(
            `User with id ${createRequestDto.userId} not found`,
          );
        }
        return user;
      }),
      mergeMap(() => {
        return this.client.send('request.create', { ...createRequestDto });
      }),
      map((res) => this.processResponse(res)),
    );
  }

  public finishRequest(requestId: string): Observable<any> {
    return this.client
      .send('request.finish', { requestId })
      .pipe(map((res) => this.processResponse(res)));
  }

  public assignRequest(assignRequestDto: AssignRequestDto): Observable<any> {
    return from(this.redis.getClient().get(assignRequestDto.volunteerId)).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException(
            `User with id ${assignRequestDto.volunteerId} not found`,
          );
        }
        return user;
      }),
      mergeMap(() => {
        return this.client.send('request.assign', {
          requestId: assignRequestDto.requestId,
          volunteerId: assignRequestDto.volunteerId,
        });
      }),
      map((res) => this.processResponse(res)),
    );
  }

  public unassignRequest(
    unassignRequestDto: AssignRequestDto,
  ): Observable<any> {
    return from(
      this.redis.getClient().get(unassignRequestDto.volunteerId),
    ).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException(
            `User with id ${unassignRequestDto.volunteerId} not found`,
          );
        }
        return user;
      }),
      mergeMap(() => {
        return this.client.send('request.unassign', {
          requestId: unassignRequestDto.requestId,
          volunteerId: unassignRequestDto.volunteerId,
        });
      }),
      map((res) => this.processResponse(res)),
    );
  }

  public updateRequest(updateRequestDto: UpdateRequestDto): Observable<any> {
    return from(this.redis.getClient().get(updateRequestDto.userId)).pipe(
      map((user) => {
        if (!user) {
          throw new NotFoundException(
            `User with id ${updateRequestDto.userId} not found`,
          );
        }
        return user;
      }),
      mergeMap(() => {
        return this.client.send('request.update', { ...updateRequestDto });
      }),
      map((res) => this.processResponse(res)),
    );
  }

  public deleteRequest(requestId: string): Observable<any> {
    return this.client
      .send('request.delete', { requestId })
      .pipe(map((res) => this.processResponse(res)));
  }

  private processResponse(res: any): any {
    if (res?.status && res?.status !== 200) {
      throw new HttpException(res, res.status);
    }
    return res;
  }
}
