import { SetMetadata } from '@nestjs/common';
import _ from 'lodash';
import { Role } from '../../enums';

export const ROLES_KEY = 'roles';
export const RoleDecorator = (...roles: Role[]) => {
  const mappingRoles = _.flatMap(roles);
  return SetMetadata(ROLES_KEY, mappingRoles);
};
