import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, HttpException, HttpStatus, Patch, Headers, UnauthorizedException } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ProfilePictureDto } from './dto/profile-picture.dto';
import { Request } from 'express';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @Req() req: Request) {
    try {
      console.log('Employee creation DTO received:', createEmployeeDto);
      
      const result = await this.employeeService.create(createEmployeeDto);
      console.log('Employee created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating employee:', error);
      if (error.code === '23505') {
        throw new HttpException('A conflict occurred. This might be due to duplicate employee code or user association.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to create employee profile.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.employeeService.findAll();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to fetch employees.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  @Get('profile')
  async getProfile(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader) {
        throw new UnauthorizedException('No authentication token provided');
      }

      // Extract token from Bearer header
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid authorization header format');
      }

      return await this.employeeService.getEmployeeProfile(token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch employee profile.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const employee = await this.employeeService.findOne(id);
      if (!employee) {
        throw new HttpException('Employee not found.', HttpStatus.NOT_FOUND);
      }
      return employee;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Failed to fetch employee.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const result = await this.employeeService.update(id, updateEmployeeDto);
      if (!result) {
        throw new HttpException('Employee not found.', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'Success',
        message: 'Employee updated successfully.',
        data: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505') {
        throw new HttpException('A conflict occurred. This might be due to duplicate employee code or email.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to update employee.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.employeeService.remove(id);
      if (!result) {
        throw new HttpException('Employee not found.', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'Success',
        message: 'Employee deleted successfully. User account preserved with Inactive role.',
        data: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || 'Failed to delete employee.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Upload profile picture for an employee
   */
  @Post('profile-picture/:employeeId')
  async uploadProfilePicture(
    @Param('employeeId') employeeId: string,
    @Body() profilePictureDto: ProfilePictureDto,
    @Headers('authorization') authHeader: string
  ) {
    try {
      if (!authHeader) {
        throw new UnauthorizedException('No authentication token provided');
      }

      // Extract token from Bearer header
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Invalid authorization header format');
      }

      return await this.employeeService.uploadProfilePicture(employeeId, profilePictureDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to upload profile picture.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get profile picture for an employee
   */
  @Get('profile-picture/:employeeId')
  async getProfilePicture(@Param('employeeId') employeeId: string) {
    try {
      return await this.employeeService.getProfilePicture(employeeId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to get profile picture.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get employee by user ID
   */
  @Get('user/:userId')
  async getEmployeeByUserId(@Param('userId') userId: string) {
    try {
      const employee = await this.employeeService.findByUserId(userId);
      if (!employee) {
        throw new HttpException('Employee not found for this user.', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'Success',
        data: employee
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to get employee by user ID.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get employee by user ID (alternative path)
   */
  @Get('by-user/:userId')
  async getEmployeeByUserIdAlt(@Param('userId') userId: string) {
    try {
      const employee = await this.employeeService.findByUserId(userId);
      if (!employee) {
        throw new HttpException('Employee not found for this user.', HttpStatus.NOT_FOUND);
      }
      return {
        status: 'Success',
        data: employee
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to get employee by user ID.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Update salary status for an employee
   */
  @Put(':id/salary-status')
  async updateSalaryStatus(@Param('id') id: string, @Body() body: { status: string }) {
    try {
      const { status } = body;
      if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
        throw new HttpException('Invalid salary status provided.', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.employeeService.updateSalaryStatus(id, status);
      return {
        status: 'Success',
        message: `Salary status updated to ${status} successfully`,
        data: result
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to update salary status.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
