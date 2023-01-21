import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import _ from 'lodash';
import { Admin } from '../../modules/entities/admin.entity';
import { User } from '../../modules/entities/users.entity';

export const UserDecorator = createParamDecorator((_data, ctx: ExecutionContext): User | Admin => {
  const req = ctx.switchToHttp().getRequest();
  const mappingReqUser = _.omit(req.user, ['password']) as User | Admin;
  return mappingReqUser;
});
