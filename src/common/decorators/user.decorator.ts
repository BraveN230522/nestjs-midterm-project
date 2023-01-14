import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../admin/users/users.entity';
import _ from 'lodash';

export const UserDecorator = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    const mappingReqUser = _.omit(req.user, ['password']) as User;
    return mappingReqUser;
  },
);
