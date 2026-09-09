import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Workspace = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.workspace;
  },
);
