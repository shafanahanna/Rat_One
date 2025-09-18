import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignDesignationDto } from './dto/assign-designation.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<any[]> {
    // Using TypeORM repository
    const userRepository = this.databaseService.getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'username', 'email', 'role', 'created_at']
    });
    
    // Map username to name for frontend consistency
    return users.map(user => ({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }));
  }

  async findOne(id: string): Promise<any> {
    const userRepository = this.databaseService.getRepository(User);
    const user = await userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'email', 'role', 'employee_id', 'country_id', 'branch_id', 'created_at', 'designationId']
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Map username to name for frontend consistency
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      employee_id: user.employee_id,
      country_id: user.country_id,
      branch_id: user.branch_id,
      created_at: user.created_at,
      designationId: user.designationId
    };
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { name, email, password, role, designationId } = createUserDto;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Using TypeORM repository
    const userRepository = this.databaseService.getRepository(User);
    
    // Create user object with basic info
    const newUser = userRepository.create({
      username: name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role
    });
    
    // If designationId is provided, set it
    if (designationId) {
      newUser.designationId = designationId;
    }
    // If no designationId is provided but role is, try to find the designation by name
    else if (role) {
      try {
        // Import the Designation entity
        const { Designation } = await import('../../designations/entities/designation.entity');
        
        // Get the designation repository
        const designationRepository = this.databaseService.getRepository(Designation);
        
        // Try to find a designation with the given name
        const designation = await designationRepository.findOne({ where: { name: role } });
        
        // If found, set the designationId
        if (designation) {
          newUser.designationId = designation.id;
        }
      } catch (error) {
        console.error('Error finding designation by name:', error);
        // Continue without setting designationId if there's an error
      }
    }
    
    const savedUser = await userRepository.save(newUser);
    
    // Return user without password
    return {
      id: savedUser.id,
      name: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      designationId: savedUser.designationId,
      created_at: savedUser.created_at
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const userRepository = this.databaseService.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update user properties
    if (updateUserDto.name) {
      user.username = updateUserDto.name;
    }
    
    if (updateUserDto.email) {
      user.email = updateUserDto.email.toLowerCase();
    }
    
    if (updateUserDto.role) {
      user.role = updateUserDto.role;
      
      // If role is updated, try to find and update designationId
      if (!updateUserDto.designationId) {
        try {
          // Import the Designation entity
          const { Designation } = await import('../../designations/entities/designation.entity');
          
          // Get the designation repository
          const designationRepository = this.databaseService.getRepository(Designation);
          
          // Try to find a designation with the given name
          const designation = await designationRepository.findOne({ where: { name: updateUserDto.role } });
          
          // If found, set the designationId
          if (designation) {
            user.designationId = designation.id;
          }
        } catch (error) {
          console.error('Error finding designation by name:', error);
          // Continue without setting designationId if there's an error
        }
      }
    }
    
    // Explicitly set designationId if provided
    if (updateUserDto.designationId) {
      user.designationId = updateUserDto.designationId;
    }
    
    if (updateUserDto.password) {
      user.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Save updated user
    const updatedUser = await userRepository.save(user);
    
    // Return user without password
    return {
      id: updatedUser.id,
      name: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      designationId: updatedUser.designationId,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    };
  }

  async remove(id: string): Promise<void> {
    const userRepository = this.databaseService.getRepository(User);
    
    // Check if user exists
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    
    // Prevent deletion of admin user
    if (user.email.toLowerCase() === 'admin@hayaltravel.com') {
      throw new Error('Cannot delete admin user');
    }
    
    await userRepository.remove(user);
  }

  async getUnassignedUsers(): Promise<any[]> {
    try {
      // Use a simpler approach - just get all users
      const userRepository = this.databaseService.getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'username', 'email', 'role', 'designationId']
      });
      
      console.log('All users found:', users.length);
      
      // Filter out admin roles
      const filteredUsers = users.filter(user => 
        !['Director', 'Admin'].includes(user.role)
      );
      
      console.log('Non-admin users found:', filteredUsers.length);
      
      // Map the results to the expected format
      return filteredUsers.map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        designationId: user.designationId
      }));
    } catch (error) {
      console.error('Error in getUnassignedUsers:', error);
      // Return empty array instead of throwing error to avoid 500
      return [];
    }
  }

  async assignDesignation(id: string, assignDesignationDto: AssignDesignationDto): Promise<User> {
    const userRepository = this.databaseService.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Update the user's designation
    user.designationId = assignDesignationDto.designationId;
    return userRepository.save(user);
  }
}
