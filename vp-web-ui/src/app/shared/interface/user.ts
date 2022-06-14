import { Role } from "../enum";

export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  role: Role;
}
