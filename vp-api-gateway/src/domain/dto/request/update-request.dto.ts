import {
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Need } from '../../enum';

export class UpdateRequestDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  heading: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  city: string | null;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  district: string | null;

  @IsPhoneNumber()
  @ValidateIf((object, value) => value !== null)
  phone: string | null;

  @IsUUID()
  userId: string;

  @IsEnum(Need)
  need: Need;
}
