import { TokenPayload } from '@/auth/types/token-payload.type';

export type MemberContext = {
  isAuthenticated: boolean;
  payload?: TokenPayload;
};
