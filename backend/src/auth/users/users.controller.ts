import { Controller, Get, Post, Body, UseGuards, Req, HttpStatus, HttpException, Put, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../dto/register.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req) {
    if (req.user.role !== UserRole.DIRECTOR) {
      throw new HttpException({
        status: "Error",
        message: "Only Director can access user management"
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      const users = await this.usersService.findAll();
      return {
        status: "Success",
        message: "Users retrieved successfully",
        data: users
      };
    } catch (error) {
      console.error("Error getting users:", error);
      throw new HttpException({
        status: "Error",
        message: "Error retrieving users"
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addUser(@Req() req, @Body() createUserDto: CreateUserDto) {
    if (req.user.role !== UserRole.DIRECTOR) {
      throw new HttpException({
        status: "Error",
        message: "You do not have permission to perform this action."
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      const newUser = await this.usersService.create(createUserDto);
      return {
        status: "Success",
        message: "USER CREATED SUCCESSFULLY - V2",
        data: newUser
      };
    } catch (error) {
      console.error("Error creating user:", error);
      
      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505') {
        throw new HttpException({
          status: "Error",
          message: "A user with this email already exists."
        }, HttpStatus.CONFLICT);
      }
      
      throw new HttpException({
        status: "Error",
        message: "An internal error occurred while creating the user."
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Req() req, @Param('id') id: string) {
    const isSelf = req.user.id === id;
    
    if (req.user.role !== UserRole.DIRECTOR ) {
      throw new HttpException({
        status: "Error",
        message: "You do not have permission to access this user."
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      const user = await this.usersService.findOne(id);
      return {
        status: "Success",
        message: "User retrieved successfully",
        data: user
      };
    } catch (error) {
      console.error("Error getting user:", error);
      throw new HttpException({
        status: "Error",
        message: "Error retrieving user"
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Req() req, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const isSelf = req.user.id === id;
    
    // Only allow role changes by Director
    if (updateUserDto.role && req.user.role !== UserRole.DIRECTOR) {
      throw new HttpException({
        status: "Error",
        message: "Only Director can change user roles."
      }, HttpStatus.FORBIDDEN);
    }
    
    if (req.user.role !== UserRole.DIRECTOR && !isSelf) {
      throw new HttpException({
        status: "Error",
        message: "You do not have permission to update this user."
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      return {
        status: "Success",
        message: "User updated successfully",
        data: updatedUser
      };
    } catch (error) {
      console.error("Error updating user:", error);
      
      // Check for unique constraint violation (duplicate email)
      if (error.code === '23505') {
        throw new HttpException({
          status: "Error",
          message: "A user with this email already exists."
        }, HttpStatus.CONFLICT);
      }
      
      throw new HttpException({
        status: "Error",
        message: "An internal error occurred while updating the user."
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Req() req, @Param('id') id: string) {
    if (req.user.role !== UserRole.DIRECTOR) {
      throw new HttpException({
        status: "Error",
        message: "Only Director can delete users."
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      await this.usersService.remove(id);
      return {
        status: "Success",
        message: "User deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new HttpException({
        status: "Error",
        message: "An internal error occurred while deleting the user."
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('unassigned')
  async getUnassignedUsers(@Req() req) {
    // Check if user has appropriate role (Director, HR) or is superuser
    const allowedRoles = [UserRole.DIRECTOR, UserRole.HR];
    
    if (!allowedRoles.includes(req.user.role) ) {
      throw new HttpException({
        status: "Error",
        message: "Only Director, HR, or superuser can access unassigned users"
      }, HttpStatus.FORBIDDEN);
    }
    
    try {
      const users = await this.usersService.getUnassignedUsers();
      return {
        status: "Success",
        message: "Unassigned users retrieved successfully",
        data: users
      };
    } catch (error) {
      console.error("Error getting unassigned users:", error);
      throw new HttpException({
        status: "Error",
        message: "Error retrieving unassigned users"
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
