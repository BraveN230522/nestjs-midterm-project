import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../../admin/users/users.entity';

export const UserDecorator = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    console.log({ reqreq: req });
    return req.user;
  },
);
