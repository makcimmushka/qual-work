import { Role } from '../../enum';

export interface CreateUserDto {
  phone: string;
  password: string;
  name: string;
  role: Role;
}
