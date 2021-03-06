import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from '../../module/auth';
import { JwtPayload } from '../../domain/interface/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token: string = this.tokenService.extractToken(req);

    if (!this.tokenService.verify(token)) {
      throw new UnauthorizedException('Token is invalid');
    }

    const jwtPayload: JwtPayload = this.tokenService.decode(token);

    return roles.includes(jwtPayload.role);
  }
}
