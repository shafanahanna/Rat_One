import { Controller, Get, Post, Body, UseGuards, Req, HttpStatus, HttpException, Put, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignDesignationDto } from './dto/assign-designation.dto';
import { UsersService } from './users.service';
import { Permissions } from '../decorators/permissions.decorator';
import { DesignationPermissionGuard } from '../guards/designation-permission.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.view')
  @Get()
  async getAllUsers() {
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

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.create')
  @Post()
  async addUser(@Body() createUserDto: CreateUserDto) {
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

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.view')
  @Get(':id')
  async getUser(@Param('id') id: string) {
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

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.edit')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.delete')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.usersService.remove(id);
      return {
        status: "Success",
        message: "User deleted successfully"
      };
    } catch (error) {
      throw new HttpException({
        status: "Error",
        message: error.message || "Failed to delete user"
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions('users.edit')
  @Put(':id/designation')
  async assignDesignation(@Param('id') id: string, @Body() assignDesignationDto: AssignDesignationDto) {
    try {
      const user = await this.usersService.assignDesignation(id, assignDesignationDto);
      return {
        status: "Success",
        message: "Designation assigned successfully",
        data: {
          id: user.id,
          designationId: user.designationId
        }
      };
    } catch (error) {
      throw new HttpException({
        status: "Error",
        message: error.message || "Failed to assign designation"
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard, DesignationPermissionGuard)
  @Permissions(['users', 'hr']) // User needs either 'users' OR 'hr' permission
  @Get('unassigned')
  async getUnassignedUsers() {
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
