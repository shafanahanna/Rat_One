import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { DatabaseService } from './database.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { RolesService } from './roles/roles.service';
export declare class AuthService {
    private readonly jwtService;
    private readonly dbService;
    private userRepository;
    private readonly rolesService;
    constructor(jwtService: JwtService, dbService: DatabaseService, userRepository: Repository<User>, rolesService: RolesService);
    private readonly UUID_REGEX;
    private isValidUUID;
    register(registerDto: RegisterDto): Promise<{
        status: string;
        message: string;
        data: {
            id: string;
            username: string;
            email: string;
            role: string;
            employee_id: string;
            country_id: string;
            branch_id: string;
            created_at: Date;
            updated_at: Date;
        };
    }>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
}
