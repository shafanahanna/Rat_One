import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class JwtAuthGuard {
    private jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): boolean;
    private extractTokenFromHeader;
}
