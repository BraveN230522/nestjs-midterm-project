import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import _ from 'lodash';
import { User } from '../../modules/users/users.entity';

export const UserDecorator = createParamDecorator((_data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  const mappingReqUser = _.omit(req.user, ['password']) as User;
  return mappingReqUser;
});
