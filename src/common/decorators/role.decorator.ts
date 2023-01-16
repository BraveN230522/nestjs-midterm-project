import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enums';

export const ROLES_KEY = 'roles';
export const RoleDecorator = (...roles: Role[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
