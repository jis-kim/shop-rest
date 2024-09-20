import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MemberContext } from '../types/member-context.type';
import { Request } from 'express';

export const GetMemberContext = createParamDecorator((data: unknown, ctx: ExecutionContext): MemberContext => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.memberContext;
});
