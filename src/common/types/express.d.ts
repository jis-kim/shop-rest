import 'express';
import { MemberContext } from '../../auth/guard/member-context.guard';

declare module 'express' {
  interface Request {
    memberContext: MemberContext;
    headers: {
      authorization?: string;
    } & Express.Request['headers'];
  }
}
