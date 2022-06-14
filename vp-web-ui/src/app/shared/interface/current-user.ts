import { Role } from "../enum";

export interface CurrentUser {
  userId: string;
  role: Role;
  token: string;
}
