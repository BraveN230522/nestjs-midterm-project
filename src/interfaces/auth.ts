import { Role } from '../enums';

export interface JwtPayload {
  username: string;
  role: Role;
}
