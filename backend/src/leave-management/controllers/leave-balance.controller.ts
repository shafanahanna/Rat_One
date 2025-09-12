import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Logger, BadRequestException } from '@nestjs/common';
import { LeaveBalanceService } from '../services/leave-balance.service';
import { CreateLeaveBalanceDto } from '../dto/create-leave-balance.dto';
import { UpdateLeaveBalanceDto } from '../dto/update-leave-balance.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('leave-management/leave-balances')
@UseGuards(JwtAuthGuard)
export class LeaveBalanceController {
  private readonly logger = new Logger(LeaveBalanceController.name);
  
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Post()
  @Roles('HR', 'Director')
  create(@Body() createLeaveBalanceDto: CreateLeaveBalanceDto) {
    return this.leaveBalanceService.create(createLeaveBalanceDto);
  }

  @Get()
  @Roles('HR', 'Director')
  async findAll() {
    return await this.leaveBalanceService.findAll();
  }

  @Get('employee/:employeeId')
  async findByEmployee(
    @Param('employeeId') employeeId: string,
    @Query('year') yearParam?: string,
    @GetUser() user?: any,
  ) {
    this.logger.log(`Fetching leave balances for employee: ${employeeId}, year: ${yearParam || 'current'}`);
    this.logger.log(`User object: ${JSON.stringify(user)}`);
    
    try {
      // Default to current year if not specified
      const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
      
      // Check if user is HR or Director (can view any employee's leave balances)
      const isHRorDirector = user.role === 'HR' || user.role === 'Director';
      
      // Get the employee ID from the JWT token
      let userEmployeeId = user.employeeId || user.employee_id;
      
      // If employee ID is not in the token, try to find it from the database
      if (!userEmployeeId) {
        try {
          this.logger.log(`Employee ID not found in token, attempting to find it for user ID: ${user.id}`);
          
          // Use the database service to query the employee table
          const employeeQuery = await this.leaveBalanceService.findEmployeeByUserId(user.id);
          
          if (employeeQuery) {
            userEmployeeId = employeeQuery.id;
            this.logger.log(`Found employee ID ${userEmployeeId} for user ${user.id} from database`);
          } else {
            this.logger.warn(`No employee record found for user ID: ${user.id}`);
          }
        } catch (err) {
          this.logger.error(`Error finding employee ID for user ${user.id}: ${err.message}`);
        }
      }
      
      this.logger.log(`User role: ${user.role}, User ID: ${user.id}, User employee ID: ${userEmployeeId}, Requested employee ID: ${employeeId}`);
      
      // Special case: If the user is trying to access their own leave balances but we don't have their employee ID
      // and they're using their own user ID as the employee ID parameter (common frontend pattern)
      const isUserIdMatchingEmployeeId = String(user.id).toLowerCase() === String(employeeId).toLowerCase();
      
      // Convert both IDs to strings and compare them case-insensitively
      const isOwnBalance = (userEmployeeId && String(userEmployeeId).toLowerCase() === String(employeeId).toLowerCase()) || isUserIdMatchingEmployeeId;
      
      // Log the comparison for debugging
      this.logger.log(`Comparing user employee ID: ${userEmployeeId} with requested employee ID: ${employeeId}, match: ${isOwnBalance}`);
      
      if (!isHRorDirector && !isOwnBalance) {
        this.logger.warn(`User ${user.id} with role ${user.role} attempted to access leave balances for employee ${employeeId}`);
        return { 
          success: false,
          message: 'You can only view your own leave balances',
          data: [] // Include empty data array to match expected structure
        };
      }
      
      // If we reach here, the user is authorized to view these leave balances
      const balances = await this.leaveBalanceService.findByEmployee(employeeId, year);
      
      this.logger.log(`Found ${balances.length} leave balances for employee ${employeeId} for year ${year}`);
      
      return {
        success: true,
        data: balances
      };
    } catch (error) {
      this.logger.error(`Error fetching leave balances: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to fetch leave balances: ${error.message}`);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveBalanceService.findOne(id);
  }

  @Patch(':id')
  @Roles('HR', 'Director')
  update(@Param('id') id: string, @Body() updateLeaveBalanceDto: UpdateLeaveBalanceDto) {
    return this.leaveBalanceService.update(id, updateLeaveBalanceDto);
  }

  @Delete(':id')
  @Roles('Director')
  remove(@Param('id') id: string) {
    return this.leaveBalanceService.remove(id);
  }
  
  @Post('populate')
  @Roles('HR', 'Director')
  async populateLeaveBalances(@Query('year') yearParam: string) {
    this.logger.log(`Populating leave balances for year: ${yearParam}`);
    
    // Default to current year if not specified
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    
    return this.leaveBalanceService.populateLeaveBalances(year);
  }
  
  @Get('test-populate/:year')
  @Roles('HR', 'Director')
  async testPopulateLeaveBalances(@Param('year') yearParam: string) {
    this.logger.log(`Testing leave balance population for year: ${yearParam}`);
    
    // Parse year parameter or use current year
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    
    try {
      const result = await this.leaveBalanceService.populateLeaveBalances(year);
      return {
        success: true,
        message: 'Leave balance population test completed',
        result
      };
    } catch (error) {
      this.logger.error(`Error during leave balance population test: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error during leave balance population: ${error.message}`,
        error: error.stack
      };
    }
  }
  
  @Get('status/:year')
  async getLeaveBalanceStatus(@Param('year') yearParam: string) {
    const year = yearParam ? parseInt(yearParam) : new Date().getFullYear();
    
    try {
      // Get all leave balances
      const allBalances = await this.leaveBalanceService.findAll();
      
      // Filter by year
      const balances = allBalances.filter(balance => balance.year === year);
      
      // Group by leave type
      const leaveTypeStats = {};
      balances.forEach(balance => {
        const leaveTypeId = balance.leave_type_id;
        if (!leaveTypeStats[leaveTypeId]) {
          leaveTypeStats[leaveTypeId] = {
            count: 0,
            totalAllocated: 0,
            totalUsed: 0
          };
        }
        leaveTypeStats[leaveTypeId].count++;
        leaveTypeStats[leaveTypeId].totalAllocated += balance.allocated_days;
        leaveTypeStats[leaveTypeId].totalUsed += balance.used_days || 0;
      });
      
      return {
        success: true,
        year,
        totalBalances: balances.length,
        leaveTypeStats
      };
    } catch (error) {
      this.logger.error(`Error getting leave balance status: ${error.message}`, error.stack);
      return {
        success: false,
        message: `Error getting leave balance status: ${error.message}`,
        error: error.stack
      };
    }
  }
}
