import { IsUUID } from 'class-validator';

export class FinishRequestDto {
  @IsUUID()
  requestId: string;
}
