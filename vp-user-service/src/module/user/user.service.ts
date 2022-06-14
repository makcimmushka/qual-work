import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity';
import { Repository } from 'typeorm';
import { LoggerService } from '../../common/logger';
import { UpdateUserDto, CreateUserDto } from '../../domain/interface/user';
import {
  Client,
  ClientKafka,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RedisService } from '../redis';

@Injectable()
export class UserService {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'vp-user-service',
        brokers: [`localhost:9092`],
      },
      producerOnlyMode: true,
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly logger: LoggerService,
    private readonly redis: RedisService,
  ) {
    this.logger.setContext(UserService.name);
  }

  public async getUser(userId: string): Promise<any> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  public async createUser(createUserDto: CreateUserDto): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existingUser) {
      throw new RpcException({ message: 'User already exists', status: 409 });
    }
    return this.usersRepository.save(createUserDto);
  }

  public async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: updateUserDto.phone },
    });
    if (existingUser && existingUser.id !== updateUserDto.id) {
      throw new RpcException({
        message: 'User with such phone already exists',
        status: 409,
      });
    }
    // const hashedPassword: string = await this.cryptoHelperService.hash(
    //   updateUserDto.password,
    // );
    return this.usersRepository.save({
      ...updateUserDto,
      //password: hashedPassword,
    });
  }

  public async deleteUser(userId: string): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      throw new RpcException({ message: 'User does not exist', status: 404 });
    }
    await this.redis.getClient().del(userId);
    await lastValueFrom(
      this.client.emit<any>('sync-user.delete', {
        userId,
        role: existingUser.role,
      }),
    );
    return this.usersRepository.delete(userId);
  }
}
