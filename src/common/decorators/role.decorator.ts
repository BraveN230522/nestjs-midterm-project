import { SetMetadata } from '@nestjs/common';
import { Role } from '../../enums';

export const ROLES_KEY = 'roles';
export const RoleDecorator = (...roles: Role[]) => {
  console.log({ roles });
  return SetMetadata(ROLES_KEY, roles);
};
