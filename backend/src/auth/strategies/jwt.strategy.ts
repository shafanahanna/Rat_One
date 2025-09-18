import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    console.log(payload)
    return { 
      id: payload.sub,
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      employeeId: payload.employeeId || null,
      designationId: payload.designationId || null
    };
  }
}
