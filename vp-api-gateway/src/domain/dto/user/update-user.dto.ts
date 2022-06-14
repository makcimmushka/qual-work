import { IsEnum, IsNotEmpty, IsPhoneNumber, IsUUID } from 'class-validator';
import { Role } from '../../../domain/enum';

export class UpdateUserDto {
  @IsUUID()
  id: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsEnum(Role)
  role: Role;
}
