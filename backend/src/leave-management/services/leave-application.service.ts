import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { LeaveBalance } from '../entities/leave-balance.entity';
import { CreateLeaveApplicationDto } from '../dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from '../dto/update-leave-application.dto';
import { differenceInBusinessDays, parseISO, addDays } from 'date-fns';
import { LeaveApplication, LeaveType } from '../entities';
import { Employee } from '../../employee/employee.entity';

@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(LeaveApplication)
    private leaveApplicationRepository: Repository<LeaveApplication>,
    @InjectRepository(LeaveBalance)
    private leaveBalanceRepository: Repository<LeaveBalance>,
    @InjectRepository(LeaveType)
    private leaveTypeRepository: Repository<LeaveType>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
   
  ) {}

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto, userId: string): Promise<LeaveApplication> {
    const { leave_type_id, start_date, end_date, employee_id } = createLeaveApplicationDto;
    
    // Determine the employee ID (either the current user or the one specified by HR/admin)
    let applicantId = employee_id || userId;
    
    // Validate that we have a valid applicantId
    if (!applicantId) {
      throw new BadRequestException('Employee ID is required for leave application');
    }
    
    // Check if leave type exists
    const leaveType = await this.leaveTypeRepository.findOne({
      where: { id: leave_type_id, is_active: true },
    });

    if (!leaveType) {
      throw new NotFoundException(`Leave type with ID ${leave_type_id} not found or inactive`);
    }

    // Calculate number of days
    const startDate = parseISO(start_date);
    const endDate = parseISO(end_date);
    
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before or equal to end date');
    }
    
    // Calculate business days between dates (excluding weekends)
    let numberOfDays = differenceInBusinessDays(addDays(endDate, 1), startDate);
    
    

    // Check for overlapping leave applications
    const overlappingLeaves = await this.leaveApplicationRepository.find({
      where: {
        employee_id: applicantId,
        status: In(['pending', 'approved']),
        start_date: Between(startDate, endDate),
      },
    });

    if (overlappingLeaves.length > 0) {
      throw new ConflictException('You already have a leave application for this period');
    }

    // Get the year from the leave application start date
    const applicationYear = startDate.getFullYear();
    
    // Check leave balance - use query builder to avoid column name issues
    let leaveBalance = await this.leaveBalanceRepository
      .createQueryBuilder('lb')
      .where('lb.employee_id = :employeeId', { employeeId: applicantId })
      .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
      .andWhere('lb.year = :year', { year: applicationYear })
      .getOne();

    // If no leave balance exists, create a default one with 0 days
    // This prevents the 404 error but will still prevent leave submission due to 0 days
    if (!leaveBalance) {
      const leaveType = await this.leaveTypeRepository.findOne({
        where: { id: leave_type_id }
      });
      
      if (!leaveType) {
        throw new NotFoundException(`Leave type with ID ${leave_type_id} not found`);
      }
      
      // Double check that applicantId is valid before creating leave balance
      if (!applicantId) {
        throw new BadRequestException('Cannot create leave balance: Employee ID is missing');
      }
      
      // Verify that the employee exists in the employees table
      const employeeExists = await this.employeeRepository.findOne({
        where: { id: applicantId }
      });
      
      if (!employeeExists) {
        // Try to find employee by user ID if applicantId is actually a user ID
        const employeeByUserId = await this.employeeRepository.findOne({
          where: { userId: applicantId }
        });
        
        if (employeeByUserId) {
          // Use the actual employee ID instead of user ID
          applicantId = employeeByUserId.id;
          
          // Check again for leave balance with the correct employee ID
          leaveBalance = await this.leaveBalanceRepository
            .createQueryBuilder('lb')
            .where('lb.employee_id = :employeeId', { employeeId: applicantId })
            .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
            .andWhere('lb.year = :year', { year: applicationYear })
            .getOne();
            
          // If we found a leave balance with the correct employee ID, use it
          // Continue with the existing leave balance
        } else {
          throw new BadRequestException(`Cannot create leave balance: No employee record found for ID ${applicantId}`);
        }
      }
      
      try {
        // Create a new leave balance with 0 allocated days
        leaveBalance = this.leaveBalanceRepository.create({
          employee_id: applicantId,
          leave_type_id,
          year: applicationYear,
          allocated_days: 0,
          used_days: 0
        });
        
        // Save the new leave balance
        leaveBalance = await this.leaveBalanceRepository.save(leaveBalance);
      } catch (error) {
        // If we get a unique constraint violation, it means another process created the record
        // between our check and save. In this case, retrieve the existing record.
        if (error.code === '23505' && error.constraint === 'unique_employee_leave_type_year') {
          console.log('Concurrent leave balance creation detected, retrieving existing record');
          leaveBalance = await this.leaveBalanceRepository
            .createQueryBuilder('lb')
            .where('lb.employee_id = :employeeId', { employeeId: applicantId })
            .andWhere('lb.leave_type_id = :leaveTypeId', { leaveTypeId: leave_type_id })
            .andWhere('lb.year = :year', { year: applicationYear })
            .getOne();
            
          if (!leaveBalance) {
            throw new BadRequestException('Failed to retrieve leave balance after concurrent creation');
          }
        } else {
          // For other errors, rethrow
          throw error;
        }
      }
    }

    // Get the days as numbers to avoid type issues
    const allocatedDays = Number(leaveBalance.allocated_days);
    const usedDays = Number(leaveBalance.used_days);
    const availableDays = allocatedDays - usedDays;
    
    if (numberOfDays > availableDays) {
      throw new BadRequestException(`Not enough leave balance. Available: ${availableDays}, Requested: ${numberOfDays}`);
    }

    // Create leave application
    const leaveApplication = this.leaveApplicationRepository.create({
      ...createLeaveApplicationDto,
      employee_id: applicantId,
      working_days: numberOfDays,
      status: 'pending', // All leave applications require approval by default
      
    });

    // Save the leave application
    const savedApplication = await this.leaveApplicationRepository.save(leaveApplication);

    return savedApplication;
  }

  async findAll(status?: string): Promise<LeaveApplication[]> {
    console.log(`[LeaveApplicationService] findAll called with status: '${status}'`);
    console.log(`[LeaveApplicationService] Status type: ${typeof status}`);
    
    const queryBuilder = this.leaveApplicationRepository.createQueryBuilder('leaveApplication')
      .leftJoinAndSelect('leaveApplication.employee', 'employee')
      .leftJoinAndSelect('leaveApplication.leaveType', 'leaveType')
      .orderBy('leaveApplication.created_at', 'DESC');
    
    // Add status filter if provided
    if (status && status !== 'undefined' && status !== 'null') {
      // Convert status to lowercase for case-insensitive comparison
      const normalizedStatus = status.toLowerCase();
      console.log(`[LeaveApplicationService] Filtering by normalized status: '${normalizedStatus}'`);
      
      // Use case-insensitive comparison with explicit values for common statuses
      if (normalizedStatus === 'pending') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['pending', 'Pending', 'PENDING'] 
        });
      } else if (normalizedStatus === 'approved') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['approved', 'Approved', 'APPROVED'] 
        });
      } else if (normalizedStatus === 'rejected') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['rejected', 'Rejected', 'REJECTED'] 
        });
      } else {
        // For any other status, use the standard case-insensitive comparison
        queryBuilder.andWhere('LOWER(leaveApplication.status) = LOWER(:status)', { status: normalizedStatus });
      }
    } else {
      console.log('[LeaveApplicationService] No status filter applied');
    }
    
    // Execute the query and get results
    try {
      const results = await queryBuilder.getMany();
      console.log(`[LeaveApplicationService] Found ${results.length} leave applications`);
      
      // Log the first few results for debugging
      if (results.length > 0) {
        console.log(`[LeaveApplicationService] First result status: ${results[0].status}`);
      }
      
      return results;
    } catch (error) {
      console.error(`[LeaveApplicationService] Error in findAll: ${error.message}`);
      throw error;
    }
    
  }

  async findByEmployee(employeeId: string): Promise<LeaveApplication[]> {
    return this.leaveApplicationRepository.find({
      where: { employee_id: employeeId },
      relations: ['leaveType'],
      order: { created_at: 'DESC' },
    });
  }
  
  async findByEmployeeWithStatus(employeeId: string, status?: string): Promise<LeaveApplication[]> {
    console.log(`[LeaveApplicationService] findByEmployeeWithStatus called with employeeId: ${employeeId}, status: '${status}'`);
    
    const queryBuilder = this.leaveApplicationRepository.createQueryBuilder('leaveApplication')
      .leftJoinAndSelect('leaveApplication.employee', 'employee')
      .leftJoinAndSelect('leaveApplication.leaveType', 'leaveType')
      .where('leaveApplication.employee_id = :employeeId', { employeeId })
      .orderBy('leaveApplication.created_at', 'DESC');
      
    // Add status filter if provided
    if (status && status !== 'undefined' && status !== 'null') {
      // Convert status to lowercase for case-insensitive comparison
      const normalizedStatus = status.toLowerCase();
      console.log(`[LeaveApplicationService] Filtering by normalized status: '${normalizedStatus}'`);
      
      // Use case-insensitive comparison with explicit values for common statuses
      if (normalizedStatus === 'pending') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['pending', 'Pending', 'PENDING'] 
        });
      } else if (normalizedStatus === 'approved') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['approved', 'Approved', 'APPROVED'] 
        });
      } else if (normalizedStatus === 'rejected') {
        queryBuilder.andWhere('LOWER(leaveApplication.status) IN (:...statuses)', { 
          statuses: ['rejected', 'Rejected', 'REJECTED'] 
        });
      } else {
        // For any other status, use the standard case-insensitive comparison
        queryBuilder.andWhere('LOWER(leaveApplication.status) = LOWER(:status)', { status: normalizedStatus });
      }
    } else {
      console.log('[LeaveApplicationService] No status filter applied for employee leave applications');
    }
    
    // Execute the query and get results
    try {
      const results = await queryBuilder.getMany();
      console.log(`[LeaveApplicationService] Found ${results.length} leave applications for employee ${employeeId}`);
      
      // Log the first few results for debugging
      if (results.length > 0) {
        console.log(`[LeaveApplicationService] First result status: ${results[0].status}`);
      }
      
      return results;
    } catch (error) {
      console.error(`[LeaveApplicationService] Error in findByEmployeeWithStatus: ${error.message}`);
      throw error;
    }
  }
  
  
  // findPendingApprovals method removed - now using status parameter in findAll method

  async countAll(): Promise<number> {
    console.log('[LeaveApplicationService] Counting all leave applications');
    return this.leaveApplicationRepository.count();
  }

  async findOne(id: string): Promise<LeaveApplication> {
    // Validate that id is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException(`Invalid leave application ID format: ${id}. Expected a UUID.`);
    }

    const leaveApplication = await this.leaveApplicationRepository.findOne({
      where: { id },
      relations: ['employee', 'leaveType'],
    });

    if (!leaveApplication) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }

    return leaveApplication;
  }

  async update(id: string, updateLeaveApplicationDto: UpdateLeaveApplicationDto): Promise<LeaveApplication> {
    const leaveApplication = await this.findOne(id);
    
    // Only allow updates if status is pending
    if (leaveApplication.status !== 'pending') {
      throw new BadRequestException('Cannot update leave application that is already approved or rejected');
    }

    // If dates are being updated, recalculate number of days
    if (updateLeaveApplicationDto.start_date || updateLeaveApplicationDto.end_date) {
      const startDate = parseISO(updateLeaveApplicationDto.start_date || leaveApplication.start_date.toISOString());
      const endDate = parseISO(updateLeaveApplicationDto.end_date || leaveApplication.end_date.toISOString());
      
      if (startDate > endDate) {
        throw new BadRequestException('Start date must be before or equal to end date');
      }
      
      // Calculate business days between dates (excluding weekends)
      let numberOfDays = differenceInBusinessDays(addDays(endDate, 1), startDate);
      
      
      
      // Update working days
      updateLeaveApplicationDto['working_days'] = numberOfDays;
      
      // Update leave balance
      const applicationYear = startDate.getFullYear();
      const leaveBalance = await this.leaveBalanceRepository.findOne({
        where: {
          employee_id: leaveApplication.employee_id,
          leave_type_id: updateLeaveApplicationDto.leave_type_id || leaveApplication.leave_type_id,
          year: applicationYear,
        },
      });
      
      if (!leaveBalance) {
        throw new NotFoundException(`No leave balance found for this employee and leave type in ${applicationYear}`);
      }
      
      
      
      
      await this.leaveBalanceRepository.save(leaveBalance);
    }

    // Update the leave application
    Object.assign(leaveApplication, updateLeaveApplicationDto);
    return this.leaveApplicationRepository.save(leaveApplication);
  }

  async cancel(id: string): Promise<LeaveApplication> {
    const leaveApplication = await this.findOne(id);
    
    // Only allow cancellation if status is pending or approved
    if (leaveApplication.status !== 'pending' && leaveApplication.status !== 'approved') {
      throw new BadRequestException('Cannot cancel leave application that is already rejected');
    }
    
    // If the leave was approved, we need to restore the leave balance
    if (leaveApplication.status === 'approved') {
      // Use the year from the leave application start date
      const applicationYear = new Date(leaveApplication.start_date).getFullYear();
      const leaveBalance = await this.leaveBalanceRepository.findOne({
        where: {
          employee_id: leaveApplication.employee_id,
          leave_type_id: leaveApplication.leave_type_id,
          year: applicationYear,
        },
      });
      
      if (leaveBalance) {
        // Restore the used days by subtracting the working days from the leave application
        const workingDays = Number(leaveApplication.working_days);
        const currentUsedDays = Number(leaveBalance.used_days);
        
        // Make sure we don't go below 0
        leaveBalance.used_days = Math.max(0, currentUsedDays - workingDays);
        await this.leaveBalanceRepository.save(leaveBalance);
      }
    }
    
    // Update status to cancelled
    leaveApplication.status = 'cancelled';
    
    return this.leaveApplicationRepository.save(leaveApplication);
  }

  async remove(id: string): Promise<void> {
    const leaveApplication = await this.findOne(id);
    await this.leaveApplicationRepository.remove(leaveApplication);
  }
  
  async updateStatus(id: string, status: string, approverId: string, comments?: string): Promise<LeaveApplication> {
    // Find the leave application
    const leaveApplication = await this.findOne(id);
    
    if (!leaveApplication) {
      throw new NotFoundException(`Leave application with ID ${id} not found`);
    }
    
    // Check if leave application is already in the requested status
    if (leaveApplication.status === status) {
      throw new BadRequestException(`Leave application is already ${status}`);
    }
    
    console.log(`[LeaveApplicationService] Updating leave application status: ${id}, approver_id: ${approverId}, status: ${status}`);
    
    // Store comments in the leave application if provided
    if (comments) {
      leaveApplication.comments = comments;
    }
    
    // Update leave application status directly
    leaveApplication.status = status;
    console.log(`[LeaveApplicationService] Successfully updated leave application status to ${status}`);
    
    
    // Update leave balance based on approval status
    if (status === 'approved' || status === 'rejected') {
      // Get the year from the leave application start date
      const applicationYear = new Date(leaveApplication.start_date).getFullYear();
      
      const leaveBalance = await this.leaveBalanceRepository.findOne({
        where: {
          employee_id: leaveApplication.employee_id,
          leave_type_id: leaveApplication.leave_type_id,
          year: applicationYear,
        },
      });

      if (leaveBalance) {
        // If approved, increase used days
        if (status === 'approved') {
          const workingDays = Number(leaveApplication.working_days);
          const currentUsedDays = Number(leaveBalance.used_days);
          const allocatedDays = Number(leaveBalance.allocated_days);
          
          // Ensure we don't exceed allocated days
          if (currentUsedDays + workingDays > allocatedDays) {
            throw new BadRequestException(
              `Cannot approve leave: would exceed allocated balance. ` +
              `Available: ${allocatedDays - currentUsedDays}, Requested: ${workingDays}`
            );
          }
          
          // Update used days
          leaveBalance.used_days = currentUsedDays + workingDays;
          await this.leaveBalanceRepository.save(leaveBalance);
        }
      } else {
        throw new NotFoundException(
          `No leave balance found for employee ID ${leaveApplication.employee_id} ` +
          `and leave type ID ${leaveApplication.leave_type_id} for year ${applicationYear}`
        );
      }
    }
    
    // Save and return the updated leave application
    return this.leaveApplicationRepository.save(leaveApplication);
  }
}
