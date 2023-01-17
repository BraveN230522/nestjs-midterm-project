import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import _ from 'lodash';
import { User } from '../../modules/users/users.entity';
import { Admin } from './../../modules/admin/admin.entity';

export const UserDecorator = createParamDecorator((_data, ctx: ExecutionContext): User | Admin => {
  const req = ctx.switchToHttp().getRequest();
  const mappingReqUser = _.omit(req.user, ['password']) as User | Admin;
  return mappingReqUser;
});
