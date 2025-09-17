"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const database_service_1 = require("./database.service");
const user_entity_1 = require("./entities/user.entity");
const roles_service_1 = require("./roles/roles.service");
let AuthService = class AuthService {
    constructor(jwtService, dbService, userRepository, rolesService) {
        this.jwtService = jwtService;
        this.dbService = dbService;
        this.userRepository = userRepository;
        this.rolesService = rolesService;
        this.UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    }
    isValidUUID(id) {
        return typeof id === 'string' && this.UUID_REGEX.test(id);
    }
    async register(registerDto) {
        const { username, email, password_hash, role } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(password_hash, 10);
        try {
            const newUser = this.userRepository.create({
                username,
                email: email.toLowerCase(),
                password_hash: hashedPassword,
                role,
                country_id: null,
                branch_id: null,
            });
            const savedUser = await this.userRepository.save(newUser);
            const { password_hash: _, ...userResult } = savedUser;
            return {
                status: "Success",
                message: "User registered successfully",
                data: userResult,
            };
        }
        catch (error) {
            console.error("Error registering user:", error);
            if (error.code === '23505') {
                throw new common_1.ConflictException('A user with this email already exists');
            }
            throw new common_1.BadRequestException('An error occurred while registering the user');
        }
    }
    async login(loginDto) {
        const { email, password_hash } = loginDto;
        try {
            const user = await this.userRepository.findOne({
                where: { email: email.toLowerCase() }
            });
            if (!user || !user.password_hash) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordCorrect = await bcrypt.compare(password_hash, user.password_hash);
            if (!isPasswordCorrect) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isUUID = this.isValidUUID(user.id);
            let employeeId = null;
            try {
                console.log(`Looking up employee ID for user ID: ${user.id}`);
                const employeeQuery = await this.dbService.query('SELECT id FROM employees WHERE user_id = $1', [user.id]);
                console.log('Employee query result:', JSON.stringify(employeeQuery));
                if (employeeQuery && employeeQuery.length > 0) {
                    employeeId = employeeQuery[0].id;
                    console.log(`Found employee ID ${employeeId} for user ${user.id}`);
                }
                else {
                    console.log('Trying alternative query with case-insensitive comparison');
                    const altEmployeeQuery = await this.dbService.query('SELECT id FROM employees WHERE LOWER(user_id) = LOWER($1)', [user.id]);
                    console.log('Alternative query result:', JSON.stringify(altEmployeeQuery));
                    if (altEmployeeQuery && altEmployeeQuery.length > 0) {
                        employeeId = altEmployeeQuery[0].id;
                        console.log(`Found employee ID ${employeeId} for user ${user.id} with case-insensitive query`);
                    }
                    else {
                        console.log(`No employee found for user ${user.id} after trying both queries`);
                    }
                }
            }
            catch (err) {
                console.error('Error finding employee ID:', err);
            }
            let isAdmin = user.role === 'Admin' || user.role === 'Director';
            if (!isAdmin) {
                try {
                    const customRoles = await this.rolesService.findAll();
                    const userCustomRole = customRoles.find(role => role.name === user.role);
                    if (userCustomRole && userCustomRole.permissions.includes('admin')) {
                        isAdmin = true;
                    }
                }
                catch (error) {
                    console.error('Error checking custom roles:', error);
                }
            }
            const token = this.jwtService.sign({
                sub: user.id,
                id: user.id,
                role: user.role,
                email: user.email,
                isUUID: isUUID,
                is_global: isAdmin,
                employeeId: employeeId
            });
            return {
                status: "Success",
                message: "Login successful",
                token,
                role: user.role,
                id: user.id,
                idType: 'uuid',
                context: {
                    is_global: isAdmin,
                    country_id: '',
                    branch_id: ''
                }
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            console.error("Login error:", error);
            throw new common_1.UnauthorizedException('An error occurred during login');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        database_service_1.DatabaseService,
        typeorm_2.Repository,
        roles_service_1.RolesService])
], AuthService);
//# sourceMappingURL=auth.service.js.map