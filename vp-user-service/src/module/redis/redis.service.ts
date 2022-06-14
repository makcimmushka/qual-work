import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      port: 6379,
      host: 'localhost',
    });
  }

  public getClient(): Redis {
    return this.client;
  }
}
