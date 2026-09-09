import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from 'src/types/user-payload.types';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as UserPayload;
  },
);
