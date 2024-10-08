import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { TokenPayload } from '@/auth/types/token-payload.type';

const BEARER_PREFIX = 'Bearer';

@Injectable()
export class MemberContextGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (token === undefined) {
      request.memberContext = { isAuthenticated: false };
      return true;
    }

    try {
      const payload: TokenPayload = this.jwtService.verify(token);
      request.memberContext = { isAuthenticated: true, payload };
    } catch {
      request.memberContext = { isAuthenticated: false };
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // 값이 없을 경우 빈 배열을 반환 -> undefined
    return type === BEARER_PREFIX ? token : undefined;
  }
}
