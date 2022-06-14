import { HttpException, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { map, Observable } from 'rxjs';
import { LoggerService } from '../../common/logger';
import { RedisService } from '../redis';

const TOPIC_NAMES: ReadonlyArray<string> = [
  'user.get',
  'user.create',
  'user.update',
  'user.delete',
];

@Injectable()
export class UserService {
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
    this.logger.setContext(UserService.name);
  }

  public async onModuleInit() {
    TOPIC_NAMES.forEach((topicName) =>
      this.client.subscribeToResponseOf(topicName),
    );
    await this.client.connect();
  }

  public getUser(userId: string): Observable<any> {
    return this.client
      .send('user.get', { userId })
      .pipe(map((res) => this.processResponse(res)));
  }

  public createUser(createUserDto: any): Observable<any> {
    return this.client
      .send('user.create', { ...createUserDto })
      .pipe(map((res) => this.processResponse(res)));
  }

  public updateUser(updateUserDto: any): Observable<any> {
    return this.client
      .send('user.update', { ...updateUserDto })
      .pipe(map((res) => this.processResponse(res)));
  }

  public deleteUser(userId: string): Observable<any> {
    return this.client
      .send('user.delete', { userId })
      .pipe(map((res) => this.processResponse(res)));
  }

  private processResponse(res: any): any {
    if (res?.status && res?.status !== 200) {
      throw new HttpException(res, res.status);
    }
    return res;
  }
}
