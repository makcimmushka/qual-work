import { IsIn, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class SignUpDto {
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  name: string;

  @IsIn(['volunteer', 'user'])
  role: string;
}
