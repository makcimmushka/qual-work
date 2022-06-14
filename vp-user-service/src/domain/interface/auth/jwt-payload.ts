import { Role } from '../../enum';

export interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
}
