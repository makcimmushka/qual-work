import { Need } from "../enum";

export interface Request {
  id: string;
  heading: string;
  description: string;
  city: string | null;
  district: string | null;
  phone: string | null;
  userId: string;
  need: Need;
  volunteerId?: string;
  isFinished?: boolean
}
