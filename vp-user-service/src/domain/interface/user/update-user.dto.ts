import { Role } from '../../enum';

export interface UpdateUserDto {
  id: string;
  phone: string;
  password: string;
  name: string;
  role: Role;
}
