import { Injectable } from '@nestjs/common';
import { SignUpDto, SignInDto } from '../../domain/interface/auth';
import { LoggerService } from '../../common/logger';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity';
import { Repository } from 'typeorm';
import { CryptoHelperService } from '../helper';
import { TokenService } from './token.service';
import { RpcException } from '@nestjs/microservices';
import { RedisService } from '../redis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly cryptoHelperService: CryptoHelperService,
    private readonly tokenService: TokenService,
    private readonly logger: LoggerService,
    private readonly redis: RedisService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  public async signUp(signUpDto: SignUpDto): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { phone: signUpDto.phone },
    });
    if (existingUser) {
      throw new RpcException({ message: 'User already exists', status: 409 });
    }

    const hashedPassword: string = await this.cryptoHelperService.hash(
      signUpDto.password,
    );

    return this.usersRepository.save({
      phone: signUpDto.phone,
      password: hashedPassword,
      name: signUpDto.name,
      role: signUpDto.role,
    });
  }

  public async signIn(signInDto: SignInDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { phone: signInDto.phone },
    });

    if (!user) {
      throw new RpcException({ message: 'User Not Found', status: 404 });
    }

    const isPasswordCorrect: boolean = await this.cryptoHelperService.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new RpcException({ message: 'Incorrect credentials', status: 403 });
    }

    const token = this.tokenService.sign({
      userId: user.id,
      role: user.role,
    });

    await this.redis.getClient().set(user.id, token);

    return { token };
  }
}
