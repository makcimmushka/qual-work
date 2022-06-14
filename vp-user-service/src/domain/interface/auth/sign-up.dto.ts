import { Role } from '../../../domain/enum';

export interface SignUpDto {
  phone: string;
  password: string;
  name: string;
  role: Role;
}
