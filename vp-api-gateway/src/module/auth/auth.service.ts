import { map, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { LoggerService } from '../../common/logger';
import { SignInDto, SignUpDto } from '../../domain/dto/auth';

const TOPIC_NAMES: ReadonlyArray<string> = ['auth.sign-up', 'auth.sign-in'];

@Injectable()
export class AuthService {
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

  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(AuthService.name);
  }

  public async onModuleInit() {
    TOPIC_NAMES.forEach((topicName) =>
      this.client.subscribeToResponseOf(topicName),
    );
    await this.client.connect();
  }

  public signUp(signUpDto: SignUpDto): Observable<any> {
    return this.client
      .send('auth.sign-up', { ...signUpDto })
      .pipe(map((res) => this.processResponse(res)));
  }

  public signIn(signInDto: SignInDto): Observable<any> {
    return this.client
      .send('auth.sign-in', { ...signInDto })
      .pipe(map((res) => this.processResponse(res)));
  }

  private processResponse(res: any): any {
    if (res?.status && res?.status !== 200) {
      throw new HttpException(res, res.status);
    }
    return res;
  }
}
