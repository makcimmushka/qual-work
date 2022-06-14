import { IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class SignInDto {
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
