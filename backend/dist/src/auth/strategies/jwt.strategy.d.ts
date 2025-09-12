import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        userId: any;
        username: any;
        role: any;
        employeeId: any;
    }>;
}
export {};
