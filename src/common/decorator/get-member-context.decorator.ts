import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { MemberContext } from '../types/member-context.type';

export const GetMemberContext = createParamDecorator((data: unknown, ctx: ExecutionContext): MemberContext => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.memberContext;
});
