import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger, Put, Req } from '@nestjs/common';
import { LeaveApplicationService } from '../services/leave-application.service';
import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveApplicationDto } from '../dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from '../dto/update-leave-application.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { EmployeeService } from '../../employee/employee.service';

@Controller('leave-management/leave-applications')
@UseGuards(JwtAuthGuard)
export class LeaveApplicationController {
  private readonly logger = new Logger(LeaveApplicationController.name);
  
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
    private readonly leaveTypeService: LeaveTypeService,
    private readonly employeeService: EmployeeService
  ) {}

  @Post()
  create(
    @Body() createLeaveApplicationDto: CreateLeaveApplicationDto,
    @GetUser() user: any,
  ) {
    this.logger.log(`Creating leave application for user: ${user.userId}`);
    
    // Set default leave_duration_type if not provided
    if (!createLeaveApplicationDto.leave_duration_type) {
      createLeaveApplicationDto['leave_duration_type'] = 'full_day';
    }
    
    // Check if user has permission to apply for someone else
    if (
      createLeaveApplicationDto.employee_id &&
      createLeaveApplicationDto.employee_id !== user.userId &&
      !['HR', 'Director'].includes(user.role)
    ) {
      return {
        message: 'You do not have permission to apply leave for other employees',
      };
    }
    
    return this.leaveApplicationService.create(createLeaveApplicationDto, user.userId);
  }

  @Get('test-api')
  async testApiAccess(@GetUser() user?: any) {
    this.logger.log('Test API endpoint accessed');
    this.logger.log('User from request:', JSON.stringify(user || {}));
    
    try {
      // Count all leave applications in the database
      const count = await this.leaveApplicationService.countAll();
      
      return {
        message: 'API access successful',
        user: user || 'No user found',
        leaveApplicationsCount: count,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error in test endpoint: ${error.message}`);
      return {
        message: 'API access successful but database error occurred',
        error: error.message
      };
    }
  }

  @Get()
  @Roles('HR', 'Director', 'DM')
  async findAll(@Query('status') status?: string, @GetUser() user?: any, @Req() request?: any) {
    console.log('=== LEAVE APPLICATION API REQUEST ===');
    console.log(`Endpoint: GET /api/leave-management/leave-applications`);
    console.log(`Status parameter: ${status || 'all'}`);
    console.log(`Status parameter type: ${typeof status}`);
    console.log(`Query parameters:`, request?.query);
    console.log('===============================');
    
    this.logger.log(`Fetching leave applications with status filter: ${status || 'all'}`);
    
    this.logger.log('Request headers:', JSON.stringify(request?.headers || {}));
    this.logger.log('User from request:', JSON.stringify(user || {}));
    this.logger.log('User role:', user?.role);
    this.logger.log('Authorization header exists:', !!request?.headers?.authorization);
    
    this.logger.log(`Status parameter type: ${typeof status}`);
    this.logger.log(`Status parameter value: '${status}'`);
    
    try {
      const results = await this.leaveApplicationService.findAll(status);
      
      console.log('=== LEAVE APPLICATION API RESPONSE ===');
      console.log(`Results count: ${results.length}`);
      if (results.length > 0) {
        console.log('First result status:', results[0].status);
        console.log('First result ID:', results[0].id);
        console.log('Status values in results:', results.map(r => r.status));
      } else {
        console.log('No results found');
      }
      console.log('===============================');
      
      this.logger.log(`Found ${results.length} leave applications with status: ${status || 'all'}`);
      return results;
    } catch (error) {
      console.log('=== LEAVE APPLICATION API RESPONSE ===');
      console.log(`Error: ${error.message}`);
      console.log('===============================');
      this.logger.error(`Error fetching leave applications: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  @Get('employee/:employeeId')
  findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query('status') status: string,
    @GetUser() user: any,
  ) {
    // Allow users to view their own leave applications
    if (!['HR', 'Director'].includes(user.role) && user.employeeId !== employeeId) {
      return {
        message: 'You can only view your own leave applications',
      };
    }
    
    this.logger.log(`Fetching leave applications for employee ${employeeId} with status filter: ${status || 'all'}`); 
    
    // Use the new method that supports status filtering
    if (status) {
      return this.leaveApplicationService.findByEmployeeWithStatus(employeeId, status);
    } else {
      return this.leaveApplicationService.findByEmployee(employeeId);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveApplicationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto,
    @GetUser() user: any,
  ) {
    // Check if user has permission to update this leave application
    const leaveApplication = this.leaveApplicationService.findOne(id);
    
    if (
      !['HR', 'Director'].includes(user.role) &&
      user.employeeId !== leaveApplication['employee_id']
    ) {
      return {
        message: 'You do not have permission to update this leave application',
      };
    }
    
    return this.leaveApplicationService.update(id, updateLeaveApplicationDto);
  }
  
  @Patch(':id/status')
  @Roles('HR', 'Director', 'DM')
  async updateStatus(
    @Param('id') id: string,
    @Body() statusUpdate: { status: string, comments?: string },
    @GetUser() user: any,
  ) {
    this.logger.log(`Updating leave application status: ${id} to ${statusUpdate.status} by employee ${user.employeeId || 'unknown'}`);
    
    // Validate status value
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(statusUpdate.status)) {
      return {
        success: false,
        message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`
      };
    }
    
    try {
      // Verify that the leave application exists
      try {
        await this.leaveApplicationService.findOne(id);
        this.logger.log(`Found leave application with ID: ${id}`);
      } catch (error) {
        this.logger.error(`Error finding leave application with ID ${id}: ${error.message}`);
        return {
          success: false,
          message: `Could not find leave application with ID ${id}.`,
          error: error.message
        };
      }
      
      // Get employee ID from user object or find it if not available
      let employeeId = user.employeeId;
      
      // If employeeId is not in the user object, try to find it
      if (!employeeId) {
        try {
          const employee = await this.employeeService.findByUserId(user.id);
          employeeId = employee.id;
          this.logger.log(`Found employee ID ${employeeId} for user ${user.id}`);
        } catch (error) {
          this.logger.error(`Error finding employee for user ${user.id}: ${error.message}`);
          return {
            success: false,
            message: `Could not find employee record for the current user. Please contact HR.`,
            error: error.message
          };
        }
      }
      
      // Log detailed information for debugging
      this.logger.log(`Processing approval - Leave Application ID: ${id}, Approver ID: ${employeeId}, Status: ${statusUpdate.status}`);
      
      // Use the leave application service to handle the status update
      const result = await this.leaveApplicationService.updateStatus(
        id, // leave_application_id
        statusUpdate.status,
        employeeId, // approver_id
        statusUpdate.comments || ''
      );
      
      return {
        success: true,
        message: `Leave application status updated to ${statusUpdate.status}`,
        data: result
      };
    } catch (error) {
      this.logger.error(`Error updating leave application status: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message,
        error: error.stack
      };
    }
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @GetUser() user: any,
  ) {
    // Check if user has permission to cancel this leave application
    const leaveApplication = this.leaveApplicationService.findOne(id);
    
    if (
      !['HR', 'Director'].includes(user.role) &&
      user.employeeId !== leaveApplication['employee_id']
    ) {
      return {
        message: 'You do not have permission to cancel this leave application',
      };
    }
    
    return this.leaveApplicationService.cancel(id);
  }

  @Delete(':id')
  @Roles('Director')
  remove(@Param('id') id: string) {
    return this.leaveApplicationService.remove(id);
  }
  
  @Get('leave-types')
  findAllLeaveTypes() {
    return this.leaveTypeService.findAll();
  }
}
