import { IsUUID } from 'class-validator';

export class AssignRequestDto {
  @IsUUID()
  requestId: string;

  @IsUUID()
  volunteerId: string;
}
