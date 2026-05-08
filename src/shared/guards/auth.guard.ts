import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { JwtService } from '@nestjs/jwt';
import { promises } from 'dns';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private JWTService: JwtService) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = await this.JWTService.verifyAsync(token, {
        secret: 'batman',
      });
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
    return true;
  }
}
