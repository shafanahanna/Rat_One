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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database.service");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../entities/user.entity");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async findAll() {
        const userRepository = this.databaseService.getRepository(user_entity_1.User);
        const users = await userRepository.find({
            select: ['id', 'username', 'email', 'role', 'created_at']
        });
        return users.map(user => ({
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            created_at: user.created_at
        }));
    }
    async findOne(id) {
        const userRepository = this.databaseService.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({
            where: { id },
            select: ['id', 'username', 'email', 'role', 'employee_id', 'country_id', 'branch_id', 'created_at']
        });
        if (!user) {
            throw new Error('User not found');
        }
        return {
            id: user.id,
            name: user.username,
            email: user.email,
            role: user.role,
            employee_id: user.employee_id,
            country_id: user.country_id,
            branch_id: user.branch_id,
            created_at: user.created_at
        };
    }
    async create(createUserDto) {
        const { name, email, password, role } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRepository = this.databaseService.getRepository(user_entity_1.User);
        const newUser = userRepository.create({
            username: name,
            email: email.toLowerCase(),
            password_hash: hashedPassword,
            role
        });
        const savedUser = await userRepository.save(newUser);
        return {
            id: savedUser.id,
            name: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            created_at: savedUser.created_at
        };
    }
    async update(id, updateUserDto) {
        const userRepository = this.databaseService.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        if (updateUserDto.name) {
            user.username = updateUserDto.name;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email.toLowerCase();
        }
        if (updateUserDto.role) {
            user.role = updateUserDto.role;
        }
        if (updateUserDto.password) {
            user.password_hash = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await userRepository.save(user);
        return {
            id: updatedUser.id,
            name: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at
        };
    }
    async remove(id) {
        const userRepository = this.databaseService.getRepository(user_entity_1.User);
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        if (user.email.toLowerCase() === 'admin@hayaltravel.com') {
            throw new Error('Cannot delete admin user');
        }
        await userRepository.remove(user);
    }
    async getUnassignedUsers() {
        const allUsersQuery = `SELECT id, username, role, employee_id FROM users`;
        const allUsers = await this.databaseService.query(allUsersQuery);
        console.log('All users in database:', allUsers);
        const allEmployeesQuery = `SELECT id, user_id FROM employees`;
        const allEmployees = await this.databaseService.query(allEmployeesQuery);
        console.log('All employees in database:', allEmployees);
        const query = `
      SELECT u.id, u.username as name, u.email, u.role, u.employee_id
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1 FROM employees e WHERE e.user_id = u.id
      )
      AND u.role != 'Director'
      -- Removed the employee_id IS NULL condition since it might be filtering out valid users
      ORDER BY u.username
    `;
        console.log('Executing unassigned users query:', query);
        const users = await this.databaseService.query(query);
        console.log('Unassigned users query result:', users);
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map