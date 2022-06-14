import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../domain/interface/auth';

@Injectable()
export class TokenService {
  private jwtSecretKey: string;

  constructor(private readonly config: ConfigService) {
    this.jwtSecretKey = this.config.get<string>('JWT_SECRET_KEY');
  }

  public sign(jwtPayload: JwtPayload): string {
    return jwt.sign(jwtPayload, this.jwtSecretKey);
  }

  public verify(token: string): boolean {
    try {
      jwt.verify(token, this.jwtSecretKey, {
        ignoreExpiration: true,
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  public decode(token: string): JwtPayload {
    const decodedToken = jwt.verify(token, this.jwtSecretKey, {
      ignoreExpiration: true,
    }) as JwtPayload;
    return decodedToken;
  }

  public extractToken(req: Request): string {
    const bearerToken: string = req.headers['authorization'];
    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Bearer token is missing');
    }
    return bearerToken.split(' ')[1];
  }
}
