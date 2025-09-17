import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from './database.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { RolesService } from './roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DatabaseService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  // UUID validation regex
  private readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // Helper function to validate UUID format
  private isValidUUID(id: string): boolean {
    return typeof id === 'string' && this.UUID_REGEX.test(id);
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password_hash } = registerDto;

    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    try {
      // Create new user with TypeORM
      const newUser = this.userRepository.create({
        username,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        // Optional fields can be added here if provided
        country_id: null,
        branch_id: null,
      });

      // Save the user to the database
      const savedUser = await this.userRepository.save(newUser);

      // Return user data without sensitive information
      const { password_hash: _, ...userResult } = savedUser;

      return {
        status: "Success",
        message: "User registered successfully",
        data: userResult,
      };
    } catch (error) {
      console.error("Error registering user:", error);
      
      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505') {
        throw new ConflictException('A user with this email already exists');
      }

      throw new BadRequestException('An error occurred while registering the user');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password_hash } = loginDto;

    try {
      // First try to find the user with TypeORM
      const user = await this.userRepository.findOne({ 
        where: { email: email.toLowerCase() } 
      });

      if (!user || !user.password_hash) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password_hash, user.password_hash);

      if (!isPasswordCorrect) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isUUID = this.isValidUUID(user.id);
      
      // Find associated employee ID if it exists
      let employeeId = null;
      try {
        console.log(`Looking up employee ID for user ID: ${user.id}`);
        
        // Query the employee table to find an employee with this user ID
        const employeeQuery = await this.dbService.query(
          'SELECT id FROM employees WHERE user_id = $1',
          [user.id]
        );
        
        console.log('Employee query result:', JSON.stringify(employeeQuery));
        
        if (employeeQuery && employeeQuery.length > 0) {
          employeeId = employeeQuery[0].id;
          console.log(`Found employee ID ${employeeId} for user ${user.id}`);
        } else {
          // Try alternative query with case-insensitive comparison
          console.log('Trying alternative query with case-insensitive comparison');
          const altEmployeeQuery = await this.dbService.query(
            'SELECT id FROM employees WHERE LOWER(user_id) = LOWER($1)',
            [user.id]
          );
          
          console.log('Alternative query result:', JSON.stringify(altEmployeeQuery));
          
          if (altEmployeeQuery && altEmployeeQuery.length > 0) {
            employeeId = altEmployeeQuery[0].id;
            console.log(`Found employee ID ${employeeId} for user ${user.id} with case-insensitive query`);
          } else {
            console.log(`No employee found for user ${user.id} after trying both queries`);
          }
        }
      } catch (err) {
        console.error('Error finding employee ID:', err);
        // Continue without employee ID if there's an error
      }

      // Determine if the user should have admin privileges
      // Since the role column has been removed, we'll use a simple heuristic
      let isAdmin = false;
      
      // Check if the user's email contains admin or director
      if (user.email && (user.email.includes('admin') || user.email.includes('director'))) {
        isAdmin = true;
      }
      
      // In a real implementation, we would check the user_roles table to determine permissions
      // But for now, we'll use this simple approach
      
      // Determine a role value to include in the token
      // This is a temporary solution until proper role management is implemented
      const userRole = isAdmin ? 'Admin' : 'User';
      
      const token = this.jwtService.sign(
        { 
          sub: user.id, 
          id: user.id, 
          email: user.email,
          isUUID: isUUID,
          is_global: isAdmin,
          employeeId: employeeId,
          role: userRole // Include the determined role
        }
      );

      return {
        status: "Success",
        message: "Login successful",
        token,
        role: userRole, // Use the determined role
        id: user.id,
        idType: 'uuid',
        context: {
          is_global: isAdmin,
          country_id: '',
          branch_id: ''
        }
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      console.error("Login error:", error);
      throw new UnauthorizedException('An error occurred during login');
    }
  }
}
