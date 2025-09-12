import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            username: string;
            email: string;
            role: import("./dto/register.dto").UserRole;
            employee_id: string;
            country_id: string;
            branch_id: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
}
