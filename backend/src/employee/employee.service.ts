import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, UnauthorizedException, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ProfilePictureDto } from './dto/profile-picture.dto';
import { Employee } from './employee.entity';
import { User } from '../auth/entities/user.entity';
import { SyncDesignationService } from './sync-designation.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
    private jwtService: JwtService,
    private configService: ConfigService,
    private syncDesignationService: SyncDesignationService,
    @Inject('CLOUDINARY_SERVICE') private cloudinaryService: any,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<any> {
    console.log('Service: Creating employee with DTO:', JSON.stringify(createEmployeeDto, null, 2));
    
    // Check if user already has an employee profile
    const existingEmployee = await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.userId = :userId', { userId: createEmployeeDto.user_id })
      .getOne();

    if (existingEmployee) {
      console.log('Service: User already has an employee profile', existingEmployee);
      throw new ConflictException('User already has an employee profile');
    }

    // Generate employee code if not provided
    let empCode = createEmployeeDto.emp_code;
    if (!empCode) {
      empCode = await this.generateUniqueEmployeeCode();
    } else {
      // Check if employee code already exists
      const empCodeExists = await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.empCode = :empCode', { empCode })
        .getOne();

      if (empCodeExists) {
        throw new ConflictException('Employee code already exists');
      }
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create employee record
      console.log('Service: Creating employee entity with:', {
        userId: createEmployeeDto.user_id,
        fullName: createEmployeeDto.full_name,
        designation: createEmployeeDto.designation,
        department: createEmployeeDto.department,
        salary: createEmployeeDto.salary,
        dateOfJoining: new Date(createEmployeeDto.date_of_joining),
        empCode: empCode,
        branchId: createEmployeeDto.branch_id,
      });
      
      const employee = this.employeeRepository.create({
        userId: createEmployeeDto.user_id,
        fullName: createEmployeeDto.full_name,
        designation: createEmployeeDto.designation,
        department: createEmployeeDto.department,
        salary: createEmployeeDto.salary,
        dateOfJoining: new Date(createEmployeeDto.date_of_joining),
        empCode: empCode,
        branchId: createEmployeeDto.branch_id,
      });

      console.log('Service: Saving employee entity:', employee);
      const savedEmployee = await queryRunner.manager.save(employee);
      console.log('Service: Employee saved successfully:', savedEmployee);
      
      // Sync the user's designation with the employee's designation
      await this.syncDesignationService.syncUserDesignation(createEmployeeDto.user_id, createEmployeeDto.designation);
      
      await queryRunner.commitTransaction();

      return {
        status: 'Success',
        message: 'Employee profile created successfully',
        data: {
          id: savedEmployee.id,
          emp_code: savedEmployee.empCode,
        },
      };
    } catch (error) {
      console.error('Service: Error creating employee:', error);
      console.error('Service: Error details:', error.message);
      if (error.detail) {
        console.error('Service: SQL error details:', error.detail);
      }
      await queryRunner.rollbackTransaction();
      if (error.code === '23505') {
        throw new ConflictException('A conflict occurred with existing data');
      }
      throw new InternalServerErrorException(`Failed to create employee profile: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<any> {
    // Get all employees with user info and branch name
    const employees = await this.employeeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.user', 'u')
      .leftJoinAndSelect('e.branch', 'b')
      .select([
        'e.id', 'e.fullName', 'e.designation', 'e.department', 
        'e.salary', 'e.dateOfJoining', 'e.empCode',
        'u.id',  'u.email', 'u.role',
        'b.id', 
      ])
      .getMany();

    // Return the employees without trip data
    const enrichedData = employees;

    return {
      status: 'Success',
      data: enrichedData
    };
  }

  async findOne(id: string): Promise<any> {
    // Get employee with user info and branch name
    const employee = await this.employeeRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.user', 'u')
      .leftJoinAndSelect('e.branch', 'b')
      .select([
        'e.id', 'e.fullName', 'e.designation', 'e.department', 
        'e.salary', 'e.dateOfJoining', 'e.empCode',
        'u.id',  'u.email', 'u.role',
        'b.id', 
      ])
      .where('e.id = :id', { id })
      .getOne();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Return employee data without trip information
    const employeeData = {
      ...employee
    };

    return {
      status: 'Success',
      data: employeeData
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<any> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Check if emp_code is being updated and if it already exists
    if (updateEmployeeDto.emp_code && updateEmployeeDto.emp_code !== employee.empCode) {
      const empCodeExists = await this.employeeRepository
        .createQueryBuilder('employee')
        .where('employee.empCode = :empCode AND employee.id != :id', { 
          empCode: updateEmployeeDto.emp_code,
          id
        })
        .getOne();

      if (empCodeExists) {
        throw new ConflictException('Employee code already exists');
      }
    }

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update employee record
      if (updateEmployeeDto.designation) {
        employee.designation = updateEmployeeDto.designation;
        // Sync the user's designation with the updated employee designation
        await this.syncDesignationService.syncUserDesignation(employee.userId, updateEmployeeDto.designation);
      }
      
      if (updateEmployeeDto.department) employee.department = updateEmployeeDto.department;
      if (updateEmployeeDto.salary) {
        // If salary is changed, update salary status
        if (employee.salary !== updateEmployeeDto.salary) {
          employee.proposedSalary = updateEmployeeDto.salary;
          employee.salaryStatus = 'Pending';
        }
      }
      if (updateEmployeeDto.emp_code) employee.empCode = updateEmployeeDto.emp_code;
      if (updateEmployeeDto.date_of_joining) employee.dateOfJoining = updateEmployeeDto.date_of_joining;
      if (updateEmployeeDto.branch_id) employee.branchId = updateEmployeeDto.branch_id;

      await queryRunner.manager.save(employee);

      // Update user information if provided
      if (updateEmployeeDto.name || updateEmployeeDto.email || updateEmployeeDto.role) {
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        if (updateEmployeeDto.name) {
          updateFields.push(`name = $${paramIndex}`);
          updateValues.push(updateEmployeeDto.name);
          paramIndex++;
        }

        if (updateEmployeeDto.email) {
          // Check if email already exists for another user
          if (updateEmployeeDto.email) {
            const emailExists = await queryRunner.query(
              `SELECT id FROM users WHERE email = $1 AND id != (SELECT user_id FROM employees WHERE id = $2)`,
              [updateEmployeeDto.email, id]
            );

            if (emailExists.length > 0) {
              throw new ConflictException('Email already exists');
            }
          }

          updateFields.push(`email = $${paramIndex}`);
          updateValues.push(updateEmployeeDto.email);
          paramIndex++;
        }

        if (updateEmployeeDto.role) {
          updateFields.push(`role = $${paramIndex}`);
          updateValues.push(updateEmployeeDto.role);
          paramIndex++;
        }

        if (updateFields.length > 0) {
          await queryRunner.query(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = (SELECT user_id FROM employees WHERE id = $${paramIndex})`,
            [...updateValues, id]
          );
        }
      }

      await queryRunner.commitTransaction();

      // Get updated employee data
      const updatedEmployee = await this.findOne(id);
      return updatedEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update employee profile');
    }
  }

  async remove(id: string): Promise<any> {
    // Check if employee exists
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // No need to check for trips as the relation doesn't exist

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Delete the employee
      await queryRunner.manager.remove(employee);
      
      await queryRunner.commitTransaction();

      return {
        status: 'Success',
        message: 'Employee deleted successfully',
        data: { id }
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to delete employee');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Generate a unique employee code
   * Format: EMP-XXXXX where X is a random digit
   */
  private async generateUniqueEmployeeCode(retryCount = 0): Promise<string> {
    if (retryCount > 10) {
      throw new InternalServerErrorException('Failed to generate unique employee code');
    }

    // Generate a random 5-digit number
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const empCode = `EMP-${randomNum}`;

    // Check if code already exists
    const exists = await this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.empCode = :empCode', { empCode })
      .getOne();

    if (exists) {
      // Try again with incremented retry count
      return this.generateUniqueEmployeeCode(retryCount + 1);
    }

    return empCode;
  }

  /**
   * Syncs the user's designation with the employee's designation
   * This ensures that the user has the correct designation for permission checks
   */
  private async syncUserDesignation(userId: string, designationName: string): Promise<void> {
    try {
      // Use the syncDesignationService to sync the user's designation
      await this.syncDesignationService.syncUserDesignation(userId, designationName);
    } catch (error) {
      console.error('Error syncing user designation:', error);
      // Don't throw the error to avoid disrupting the main flow
    }
  }

  /**
   * Get employee profile using JWT token
   * @param token JWT token from request header
   */
  async getEmployeeProfile(token: string): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    // Try to decode token with both secrets
    let decoded;
    try {
      // First try with regular JWT secret
      decoded = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET')
      });
    } catch (jwtError) {
      try {
        // If that fails, try with admin token secret
        decoded = this.jwtService.verify(token, {
          secret: this.configService.get('ADMIN_ACCESS_TOKEN')
        });
      } catch (adminJwtError) {
        console.error('JWT verification failed with both secrets:', adminJwtError);
        throw new UnauthorizedException('Invalid authentication token');
      }
    }

    const userId = decoded.id;
    console.log('Decoded user ID from token:', userId);

    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Get user basic info
      const userResult = await queryRunner.query(
        `SELECT id as user_id, email, role, username
         FROM users
         WHERE id = $1`,
        [userId]
      );

      if (userResult.length === 0) {
        throw new NotFoundException('User not found');
      }

      const userData = userResult[0];
      console.log('User data found:', userData);
      
      // Try to get employee directly from employees table using userId
      try {
        const employeeResult = await queryRunner.query(
          `SELECT id as employee_id, full_name, department, designation, emp_code, date_of_joining, profile_picture, user_id
           FROM employees
           WHERE user_id = $1`,
          [userId]
        );
        
        
        if (employeeResult && employeeResult.length > 0) {
          const employeeData = employeeResult[0];
          await queryRunner.commitTransaction();
          
          return {
            status: 'Success',
            data: {
              id: employeeData.employee_id,
              full_name: employeeData.full_name,
              department: employeeData.department,
              designation: employeeData.designation,
              emp_code: employeeData.emp_code,
              date_of_joining: employeeData.date_of_joining,
              profile_picture: employeeData.profile_picture,
              email: userData.email,
              user_id: userData.user_id,
              role: userData.role,
              username: userData.username
            }
          };
        } else {
          // Continue to fallback approach
        }
      } catch (directQueryError) {
        console.log('Direct employee query failed:', directQueryError.message);
        // Continue to fallback approach
      }

      // If we reach here, no employee data was found, return minimal profile
      await queryRunner.commitTransaction();
      return {
        status: 'Success',
        data: {
          id: null,
          full_name: userData.username || null,
          department: null,
          designation: null,
          emp_code: null,
          profile_picture: null,
          email: userData.email,
          user_id: userData.user_id,
          role: userData.role,
          username: userData.username,
          isMinimalProfile: true
        }
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Error getting employee profile:', error);
      throw new InternalServerErrorException(`Internal server error: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Upload profile picture for an employee
   * @param employeeId ID of the employee
   * @param profilePictureDto DTO containing the profile picture URL or base64 string
   */
  async uploadProfilePicture(employeeId: string, profilePictureDto: ProfilePictureDto): Promise<any> {
    try {
      // Check if employee exists
      const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      const { profilePictureUrl } = profilePictureDto;
      if (!profilePictureUrl) {
        throw new BadRequestException('No profile picture provided');
      }

      let secureUrl: string;

      // Check if the profilePictureUrl is already a URL or a base64 string
      if (profilePictureUrl.startsWith('data:image')) {
        // Upload base64 image to Cloudinary
        secureUrl = await this.cloudinaryService.uploadImage(profilePictureUrl);
      } else {
        // Already a URL, use as is
        secureUrl = profilePictureUrl;
      }

      // Update employee record with profile picture URL
      employee.profilePicture = secureUrl;
      await this.employeeRepository.save(employee);

      return {
        status: 'Success',
        message: 'Profile picture updated successfully',
        data: {
          profile_picture: secureUrl
        }
      };
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to upload profile picture: ${error.message}`);
    }
  }

  /**
   * Get profile picture for an employee
   * @param employeeId ID of the employee
   */
  async getProfilePicture(employeeId: string): Promise<any> {
    try {
      const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      return {
        status: 'Success',
        data: {
          profile_picture: employee.profilePicture
        }
      };
    } catch (error) {
      console.error('Error getting profile picture:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to get profile picture: ${error.message}`);
    }
  }

  /**
   * Find employee by user ID
   * @param userId ID of the user
   */
  async findByUserId(userId: string): Promise<any> {
    try {
      const employee = await this.employeeRepository
        .createQueryBuilder('e')
        .leftJoinAndSelect('e.user', 'u')
        .leftJoinAndSelect('e.branch', 'b')
        .select([
          'e.id', 'e.fullName', 'e.designation', 'e.department', 
          'e.salary', 'e.dateOfJoining', 'e.empCode', 'e.userId',
          'u.id', 'u.email', 'u.role',
          'b.id', 'b.branch_name'
        ])
        .where('e.userId = :userId', { userId })
        .getOne();

      if (!employee) {
        throw new NotFoundException(`Employee not found for user ID: ${userId}`);
      }

      return employee;
    } catch (error) {
      console.error('Error finding employee by user ID:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to find employee by user ID: ${error.message}`);
    }
  }
}
