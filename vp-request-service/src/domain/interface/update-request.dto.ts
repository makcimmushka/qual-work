import { Need } from '../enum';

export interface UpdateRequestDto {
  id: string;
  heading: string;
  description: string;
  city: string | null;
  district: string | null;
  phone: string | null;
  userId: string;
  need: Need;
}
